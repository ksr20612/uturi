import type {
  AutoContrastConfig,
  AutoContrastOptions,
  ContrastResult,
  ColorAnalysis,
  AutoContrastInstance,
  ContrastMethod,
} from '../typings/contrast';
import defaultConfig from '../constants/defaultConfig';

export default class AutoContrast implements AutoContrastInstance {
  private config: Required<AutoContrastConfig>;
  private isActive: boolean = false;
  private results: ContrastResult[] = [];
  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;
  private debounceTimer?: NodeJS.Timeout;

  constructor(config: AutoContrastConfig = {}) {
    this.config = {
      ...defaultConfig,
      ...config,
    };

    if (this.config.autoLaunch) {
      this.launch();
    }
  }

  /**
   * AutoContrast를 시작합니다.
   */
  launch(): void {
    if (this.isActive) {
      this.log('AutoContrast is already active');
      return;
    }

    this.isActive = true;
    this.log('AutoContrast launched');

    // 초기 실행
    this.update();

    // 반응형 모드 설정
    if (this.config.isResponsive) {
      this.setupResponsiveMode();
    }

    // DOM 변화 감지
    this.setupMutationObserver();
  }

  /**
   * AutoContrast를 중지합니다.
   */
  stop(): void {
    if (!this.isActive) {
      this.log('AutoContrast is not active');
      return;
    }

    this.isActive = false;
    this.log('AutoContrast stopped');

    // 옵저버 정리
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();

    // 타이머 정리
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  /**
   * 모든 대상 요소를 업데이트합니다.
   */
  async update(): Promise<void> {
    if (!this.isActive) {
      this.log('AutoContrast is not active');
      return;
    }

    const elements = this.getTargetElements();
    this.log(`Updating ${elements.length} elements`);

    const promises = elements.map((element) => this.adjustElement(element));
    const results = await Promise.all(promises);

    this.results = results.filter((result) => result !== null) as ContrastResult[];
  }

  /**
   * 특정 요소의 색상을 조정합니다.
   */
  async adjustElement(element: HTMLElement): Promise<ContrastResult | null> {
    try {
      const originalColor = this.getComputedColor(
        element.style.color || window.getComputedStyle(element).color,
      );
      const backgroundColor = await this.analyzeBackground(element);

      const bestColor = this.findBestContrastColor(backgroundColor);
      const contrastRatio = this.calculateContrastRatio(bestColor, backgroundColor.averageColor);

      // 색상 적용
      element.style.color = bestColor;

      const result: ContrastResult = {
        element,
        originalColor,
        adjustedColor: bestColor,
        backgroundColor: backgroundColor.averageColor,
        contrastRatio,
        meetsStandard: contrastRatio >= this.config.minContrastRatio,
        method: this.determineMethod(backgroundColor),
        isAccessible: contrastRatio >= this.config.minContrastRatio,
      };

      this.log(`Adjusted element: ${element.tagName}`, result);
      return result;
    } catch (error) {
      this.log(`Error adjusting element: ${error}`);
      return null;
    }
  }

  /**
   * 요소의 배경을 분석합니다.
   */
  async analyzeBackground(element: HTMLElement): Promise<ColorAnalysis> {
    const computedStyle = window.getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor;
    const backgroundImage = computedStyle.backgroundImage;

    // 배경 이미지가 있는 경우
    if (backgroundImage && backgroundImage !== 'none') {
      return await this.analyzeBackgroundImage(element, backgroundImage);
    }

    // 단색 배경인 경우
    return this.analyzeSolidBackground(backgroundColor);
  }

  /**
   * 배경 이미지를 분석합니다.
   */
  private async analyzeBackgroundImage(
    element: HTMLElement,
    backgroundImage: string,
  ): Promise<ColorAnalysis> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          // 캔버스 크기 설정
          canvas.width = img.width;
          canvas.height = img.height;

          // 이미지 그리기
          ctx.drawImage(img, 0, 0);

          // 요소의 위치에 해당하는 영역 샘플링
          const rect = element.getBoundingClientRect();
          const imageRect = this.getImageRect(element, img);

          const sampleData = ctx.getImageData(
            imageRect.x,
            imageRect.y,
            Math.min(imageRect.width, this.config.sampleSize),
            Math.min(imageRect.height, this.config.sampleSize),
          );

          const analysis = this.analyzeImageData(sampleData);
          resolve(analysis);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load background image'));
      };

      // 배경 이미지 URL 추출
      const urlMatch = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (urlMatch) {
        img.src = urlMatch[1];
      } else {
        reject(new Error('Invalid background image URL'));
      }
    });
  }

  /**
   * 단색 배경을 분석합니다.
   */
  private analyzeSolidBackground(backgroundColor: string): ColorAnalysis {
    const rgb = this.parseRgbColor(backgroundColor);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const luminance = this.calculateLuminance(rgb.r, rgb.g, rgb.b);

    return {
      averageColor: this.rgbToHex(rgb.r, rgb.g, rgb.b),
      dominantColor: this.rgbToHex(rgb.r, rgb.g, rgb.b),
      luminance,
      isLight: luminance > 0.5,
      isDark: luminance <= 0.5,
      rgb,
      hsl,
    };
  }

  /**
   * 이미지 데이터를 분석합니다.
   */
  private analyzeImageData(imageData: ImageData): ColorAnalysis {
    const data = imageData.data;
    let r = 0,
      g = 0,
      b = 0;
    let pixelCount = 0;

    // 평균 색상 계산
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      pixelCount++;
    }

    r = Math.round(r / pixelCount);
    g = Math.round(g / pixelCount);
    b = Math.round(b / pixelCount);

    const luminance = this.calculateLuminance(r, g, b);
    const hsl = this.rgbToHsl(r, g, b);

    return {
      averageColor: this.rgbToHex(r, g, b),
      dominantColor: this.rgbToHex(r, g, b),
      luminance,
      isLight: luminance > 0.5,
      isDark: luminance <= 0.5,
      rgb: { r, g, b },
      hsl,
    };
  }

  /**
   * 최적의 대비 색상을 찾습니다.
   */
  private findBestContrastColor(analysis: ColorAnalysis): string {
    const lightRatio = this.calculateContrastRatio(this.config.lightColor, analysis.averageColor);
    const darkRatio = this.calculateContrastRatio(this.config.darkColor, analysis.averageColor);

    // 사용자 정의 색상이 있는 경우
    if (this.config.customColors.length > 0) {
      let bestColor = this.config.lightColor;
      let bestRatio = lightRatio;

      for (const customColor of this.config.customColors) {
        const ratio = this.calculateContrastRatio(customColor, analysis.averageColor);
        if (ratio > bestRatio) {
          bestColor = customColor;
          bestRatio = ratio;
        }
      }

      return bestColor;
    }

    // 기본 색상 중 선택
    return lightRatio > darkRatio ? this.config.lightColor : this.config.darkColor;
  }

  /**
   * 대비율을 계산합니다.
   */
  private calculateContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * 색상의 휘도를 계산합니다.
   */
  private getLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    if (!rgb) return 0;
    return this.calculateLuminance(rgb.r, rgb.g, rgb.b);
  }

  /**
   * RGB 휘도를 계산합니다.
   */
  private calculateLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * 조정 방법을 결정합니다.
   */
  private determineMethod(analysis: ColorAnalysis): 'light' | 'dark' | 'custom' {
    if (this.config.customColors.length > 0) {
      return 'custom';
    }
    return analysis.isLight ? 'dark' : 'light';
  }

  /**
   * 대상 요소들을 가져옵니다.
   */
  private getTargetElements(): HTMLElement[] {
    return Array.from(document.querySelectorAll(this.config.targetSelector));
  }

  /**
   * 반응형 모드를 설정합니다.
   */
  private setupResponsiveMode(): void {
    const handleResize = () => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        this.update();
      }, this.config.debounceTime);
    };

    window.addEventListener('resize', handleResize);

    // ResizeObserver 설정 (지원하는 경우)
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        handleResize();
      });

      this.getTargetElements().forEach((element) => {
        this.resizeObserver?.observe(element);
      });
    }
  }

  /**
   * DOM 변화 감지를 설정합니다.
   */
  private setupMutationObserver(): void {
    this.mutationObserver = new MutationObserver((mutations) => {
      let shouldUpdate = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              if (element.matches && element.matches(this.config.targetSelector)) {
                shouldUpdate = true;
              }
            }
          });
        }
      });

      if (shouldUpdate) {
        this.update();
      }
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * 계산된 색상을 가져옵니다.
   */
  private getComputedColor(cssColor: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.style.color = cssColor;
    document.body.appendChild(tempDiv);
    const computedColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return this.rgbToHex(r, g, b);
    }

    return cssColor;
  }

  /**
   * 이미지 영역을 계산합니다.
   */
  private getImageRect(
    element: HTMLElement,
    img: HTMLImageElement,
  ): { x: number; y: number; width: number; height: number } {
    const elementRect = element.getBoundingClientRect();
    const scaleX = img.width / elementRect.width;
    const scaleY = img.height / elementRect.height;

    return {
      x: Math.round(elementRect.left * scaleX),
      y: Math.round(elementRect.top * scaleY),
      width: Math.round(elementRect.width * scaleX),
      height: Math.round(elementRect.height * scaleY),
    };
  }

  /**
   * RGB 색상을 파싱합니다.
   */
  private parseRgbColor(color: string): { r: number; g: number; b: number } {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3]),
      };
    }
    return { r: 0, g: 0, b: 0 };
  }

  /**
   * Hex 색상을 RGB로 변환합니다.
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * RGB를 Hex로 변환합니다.
   */
  private rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  /**
   * RGB를 HSL로 변환합니다.
   */
  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  /**
   * 로그를 출력합니다.
   */
  private log(message: string, data?: any): void {
    if (this.config.debug) {
      console.log(`[AutoContrast] ${message}`, data || '');
    }
  }

  /**
   * 현재 설정을 반환합니다.
   */
  getConfig(): Required<AutoContrastConfig> {
    return { ...this.config };
  }

  /**
   * 설정을 업데이트합니다.
   */
  setConfig(config: Partial<AutoContrastConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }
}

