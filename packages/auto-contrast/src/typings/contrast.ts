export interface AutoContrastConfig {
  // WCAG 기준 설정
  standard?: 'AA' | 'AAA'; // WCAG 기준 (기본값: 'AA')
  minContrastRatio?: number; // 최소 대비율 (기본값: 4.5 for AA, 7.0 for AAA)

  // DOM 선택자 설정
  targetSelector?: string; // 대상 요소 선택자 (기본값: '.auto-contrast')
  backgroundSelector?: string; // 배경 요소 선택자 (기본값: '.auto-contrast-bg')

  // 색상 옵션
  lightColor?: string; // 밝은 배경용 텍스트 색상 (기본값: '#000000')
  darkColor?: string; // 어두운 배경용 텍스트 색상 (기본값: '#FFFFFF')
  customColors?: string[]; // 사용자 정의 색상 배열

  // 분석 설정
  sampleSize?: number; // 색상 분석 샘플 크기 (기본값: 10)
  tolerance?: number; // 색상 허용 오차 (기본값: 0.1)

  // 동작 설정
  isResponsive?: boolean; // 반응형 모드 (기본값: true)
  debounceTime?: number; // 디바운스 시간 (기본값: 100ms)
  autoLaunch?: boolean; // 자동 실행 (기본값: true)

  // 디버그 설정
  debug?: boolean; // 디버그 모드 (기본값: false)
}

export interface AutoContrastOptions {
  // 실행 옵션
  force?: boolean; // 강제 실행
  silent?: boolean; // 조용한 모드 (콘솔 로그 없음)

  // 대상 요소
  elements?: HTMLElement[]; // 특정 요소들만 처리
  exclude?: string[]; // 제외할 선택자들
}

export interface ContrastResult {
  element: HTMLElement;
  originalColor: string;
  adjustedColor: string;
  backgroundColor: string;
  contrastRatio: number;
  meetsStandard: boolean;
  method: 'light' | 'dark' | 'custom';
  isAccessible: boolean;
}

export interface ColorAnalysis {
  averageColor: string;
  dominantColor: string;
  luminance: number;
  isLight: boolean;
  isDark: boolean;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export interface AutoContrastInstance {
  // 메서드
  launch(): void;
  stop(): void;
  update(): void;
  adjustElement(element: HTMLElement): Promise<ContrastResult>;
  analyzeBackground(element: HTMLElement): Promise<ColorAnalysis>;

  // 설정
  getConfig(): Required<AutoContrastConfig>;
  setConfig(config: Partial<AutoContrastConfig>): void;

  // 상태
  isActive: boolean;
  results: ContrastResult[];
}

export type ContrastMethod =
  | 'automatic' // 자동 결정
  | 'light' // 밝은 색상 사용
  | 'dark' // 어두운 색상 사용
  | 'custom'; // 사용자 정의 색상 사용

