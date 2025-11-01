const DEFAULT_CONFIG = Object.freeze({
  // WCAG 기준 설정
  standard: 'AA' as const,
  minContrastRatio: 4.5,

  // DOM 선택자 설정
  targetSelector: '.auto-contrast',
  backgroundSelector: '.auto-contrast-bg',

  // 색상 옵션
  lightColor: '#000000',
  darkColor: '#FFFFFF',
  customColors: [] as string[],

  // 분석 설정
  sampleSize: 10,
  tolerance: 0.1,

  // 동작 설정
  isResponsive: true,
  debounceTime: 100,
  autoLaunch: true,

  // 디버그 설정
  debug: false,
});

export default DEFAULT_CONFIG;

