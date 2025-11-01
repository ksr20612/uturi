import { vi, describe, it, expect, beforeEach } from 'vitest';
import AutoContrast from '../../src/core/AutoContrast';

describe('BackgroundAnalysis', () => {
  let autoContrast: AutoContrast;
  let mockElement: HTMLElement;

  beforeEach(() => {
    autoContrast = new AutoContrast({ autoLaunch: false });
    mockElement = document.createElement('div');
  });

  describe('analyzeSolidBackground', () => {
    it('단색 배경을 분석해야 한다', () => {
      const analysis = (autoContrast as any).analyzeSolidBackground('rgb(255, 255, 255)');

      expect(analysis).toBeDefined();
      expect(analysis.averageColor).toBeDefined();
      expect(analysis.dominantColor).toBeDefined();
      expect(analysis.luminance).toBeGreaterThanOrEqual(0);
      expect(analysis.luminance).toBeLessThanOrEqual(1);
      expect(typeof analysis.isLight).toBe('boolean');
      expect(typeof analysis.isDark).toBe('boolean');
      expect(analysis.rgb).toBeDefined();
      expect(analysis.hsl).toBeDefined();
    });

    it('흰색 배경의 분석 결과가 정확해야 한다', () => {
      const analysis = (autoContrast as any).analyzeSolidBackground('rgb(255, 255, 255)');

      expect(analysis.luminance).toBe(1);
      expect(analysis.isLight).toBe(true);
      expect(analysis.isDark).toBe(false);
    });

    it('검은색 배경의 분석 결과가 정확해야 한다', () => {
      const analysis = (autoContrast as any).analyzeSolidBackground('rgb(0, 0, 0)');

      expect(analysis.luminance).toBe(0);
      expect(analysis.isLight).toBe(false);
      expect(analysis.isDark).toBe(true);
    });
  });

  describe('analyzeImageData', () => {
    it('이미지 데이터를 분석해야 한다', () => {
      // Mock ImageData
      const mockImageData = {
        data: new Uint8ClampedArray([
          255,
          0,
          0,
          255, // Red pixel
          0,
          255,
          0,
          255, // Green pixel
          0,
          0,
          255,
          255, // Blue pixel
          128,
          128,
          128,
          255, // Gray pixel
        ]),
      };

      const analysis = (autoContrast as any).analyzeImageData(mockImageData);

      expect(analysis).toBeDefined();
      expect(analysis.averageColor).toBeDefined();
      expect(analysis.dominantColor).toBeDefined();
      expect(analysis.luminance).toBeGreaterThanOrEqual(0);
      expect(analysis.luminance).toBeLessThanOrEqual(1);
      expect(typeof analysis.isLight).toBe('boolean');
      expect(typeof analysis.isDark).toBe('boolean');
      expect(analysis.rgb).toBeDefined();
      expect(analysis.hsl).toBeDefined();
    });

    it('빈 이미지 데이터를 처리해야 한다', () => {
      const mockImageData = {
        data: new Uint8ClampedArray(0),
      };

      const analysis = (autoContrast as any).analyzeImageData(mockImageData);

      expect(analysis).toBeDefined();
      expect(analysis.averageColor).toBe('#000000');
      expect(analysis.luminance).toBe(0);
    });
  });

  describe('findBestContrastColor', () => {
    it('밝은 배경에 대해 어두운 색상을 선택해야 한다', () => {
      const lightAnalysis = {
        averageColor: '#FFFFFF',
        isLight: true,
        isDark: false,
        luminance: 1,
      };

      const color = (autoContrast as any).findBestContrastColor(lightAnalysis);
      expect(color).toBe('#000000'); // darkColor
    });

    it('어두운 배경에 대해 밝은 색상을 선택해야 한다', () => {
      const darkAnalysis = {
        averageColor: '#000000',
        isLight: false,
        isDark: true,
        luminance: 0,
      };

      const color = (autoContrast as any).findBestContrastColor(darkAnalysis);
      expect(color).toBe('#FFFFFF'); // lightColor
    });

    it('사용자 정의 색상이 있을 때 최적의 색상을 선택해야 한다', () => {
      autoContrast.setConfig({
        customColors: ['#FF0000', '#00FF00', '#0000FF'],
      });

      const analysis = {
        averageColor: '#FFFFFF',
        isLight: true,
        isDark: false,
        luminance: 1,
      };

      const color = (autoContrast as any).findBestContrastColor(analysis);
      expect(['#FF0000', '#00FF00', '#0000FF']).toContain(color);
    });
  });

  describe('determineMethod', () => {
    it('밝은 배경에 대해 dark 방법을 선택해야 한다', () => {
      const lightAnalysis = {
        isLight: true,
        isDark: false,
      };

      const method = (autoContrast as any).determineMethod(lightAnalysis);
      expect(method).toBe('dark');
    });

    it('어두운 배경에 대해 light 방법을 선택해야 한다', () => {
      const darkAnalysis = {
        isLight: false,
        isDark: true,
      };

      const method = (autoContrast as any).determineMethod(darkAnalysis);
      expect(method).toBe('light');
    });

    it('사용자 정의 색상이 있을 때 custom 방법을 선택해야 한다', () => {
      autoContrast.setConfig({
        customColors: ['#FF0000'],
      });

      const analysis = {
        isLight: true,
        isDark: false,
      };

      const method = (autoContrast as any).determineMethod(analysis);
      expect(method).toBe('custom');
    });
  });

  describe('getImageRect', () => {
    it('이미지 영역을 정확히 계산해야 한다', () => {
      const mockImg = {
        width: 800,
        height: 600,
      };

      const mockElement = {
        getBoundingClientRect: vi.fn(() => ({
          left: 100,
          top: 50,
          width: 200,
          height: 150,
        })),
      };

      const rect = (autoContrast as any).getImageRect(mockElement, mockImg);

      expect(rect).toBeDefined();
      expect(rect.x).toBeGreaterThanOrEqual(0);
      expect(rect.y).toBeGreaterThanOrEqual(0);
      expect(rect.width).toBeGreaterThan(0);
      expect(rect.height).toBeGreaterThan(0);
    });
  });
});

