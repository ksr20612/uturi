import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import AutoContrast from '../../src/core/AutoContrast';

// Mock DOM elements
const createMockElement = (className: string = 'auto-contrast') => {
  const element = document.createElement('div');
  element.className = className;
  element.style.color = 'rgb(0, 0, 0)';
  element.style.backgroundColor = 'rgb(255, 255, 255)';
  return element;
};

// Mock getComputedStyle
const mockGetComputedStyle = vi.fn(() => ({
  color: 'rgb(0, 0, 0)',
  backgroundColor: 'rgb(255, 255, 255)',
  backgroundImage: 'none',
}));

describe('AutoContrast', () => {
  let autoContrast: AutoContrast;
  let mockElement: HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock window.getComputedStyle
    Object.defineProperty(window, 'getComputedStyle', {
      value: mockGetComputedStyle,
      writable: true,
    });

    // Mock document methods
    Object.defineProperty(document, 'querySelectorAll', {
      value: vi.fn(() => [createMockElement()]),
      writable: true,
    });

    Object.defineProperty(document, 'createElement', {
      value: vi.fn(() => ({
        style: {},
        getBoundingClientRect: vi.fn(() => ({
          left: 0,
          top: 0,
          width: 100,
          height: 100,
        })),
        matches: vi.fn(() => true),
      })),
      writable: true,
    });

    Object.defineProperty(document.body, 'appendChild', {
      value: vi.fn(),
      writable: true,
    });

    Object.defineProperty(document.body, 'removeChild', {
      value: vi.fn(),
      writable: true,
    });

    // Mock ResizeObserver
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
    }));

    // Mock MutationObserver
    global.MutationObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
    }));

    autoContrast = new AutoContrast({ autoLaunch: false });
    mockElement = createMockElement();
  });

  afterEach(() => {
    if (autoContrast) {
      autoContrast.stop();
    }
  });

  describe('생성자', () => {
    it('기본 설정으로 AutoContrast를 생성할 수 있어야 한다', () => {
      expect(autoContrast).toBeInstanceOf(AutoContrast);
    });

    it('사용자 정의 설정으로 AutoContrast를 생성할 수 있어야 한다', () => {
      const customAutoContrast = new AutoContrast({
        standard: 'AAA',
        minContrastRatio: 7.0,
        lightColor: '#FFFFFF',
        darkColor: '#000000',
      });

      expect(customAutoContrast).toBeInstanceOf(AutoContrast);
    });
  });

  describe('launch 메서드', () => {
    it('AutoContrast를 시작할 수 있어야 한다', () => {
      autoContrast.launch();
      expect(autoContrast.isActive).toBe(true);
    });

    it('이미 활성화된 상태에서 launch를 호출해도 에러가 발생하지 않아야 한다', () => {
      autoContrast.launch();
      autoContrast.launch(); // 두 번째 호출
      expect(autoContrast.isActive).toBe(true);
    });
  });

  describe('stop 메서드', () => {
    it('AutoContrast를 중지할 수 있어야 한다', () => {
      autoContrast.launch();
      autoContrast.stop();
      expect(autoContrast.isActive).toBe(false);
    });

    it('비활성화된 상태에서 stop을 호출해도 에러가 발생하지 않아야 한다', () => {
      autoContrast.stop(); // 비활성화된 상태에서 호출
      expect(autoContrast.isActive).toBe(false);
    });
  });

  describe('getConfig 메서드', () => {
    it('현재 설정을 반환해야 한다', () => {
      const config = autoContrast.getConfig();

      expect(config).toBeDefined();
      expect(config.standard).toBe('AA');
      expect(config.minContrastRatio).toBe(4.5);
      expect(config.targetSelector).toBe('.auto-contrast');
    });

    it('설정 객체의 복사본을 반환해야 한다', () => {
      const config1 = autoContrast.getConfig();
      const config2 = autoContrast.getConfig();

      expect(config1).toEqual(config2);
      expect(config1).not.toBe(config2);
    });
  });

  describe('setConfig 메서드', () => {
    it('설정을 업데이트할 수 있어야 한다', () => {
      autoContrast.setConfig({
        standard: 'AAA',
        minContrastRatio: 7.0,
      });

      const config = autoContrast.getConfig();
      expect(config.standard).toBe('AAA');
      expect(config.minContrastRatio).toBe(7.0);
    });
  });

  describe('update 메서드', () => {
    it('비활성화된 상태에서 update를 호출하면 로그만 출력해야 한다', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await autoContrast.update();

      expect(consoleSpy).toHaveBeenCalledWith('[AutoContrast] AutoContrast is not active');

      consoleSpy.mockRestore();
    });

    it('활성화된 상태에서 update를 호출하면 요소들을 업데이트해야 한다', async () => {
      autoContrast.launch();

      // Mock querySelectorAll to return elements
      const mockElements = [createMockElement(), createMockElement()];
      vi.spyOn(document, 'querySelectorAll').mockReturnValue(mockElements as any);

      await autoContrast.update();

      expect(document.querySelectorAll).toHaveBeenCalledWith('.auto-contrast');
    });
  });

  describe('adjustElement 메서드', () => {
    it('요소의 색상을 조정할 수 있어야 한다', async () => {
      const result = await autoContrast.adjustElement(mockElement);

      expect(result).toBeDefined();
      if (result) {
        expect(result.element).toBe(mockElement);
        expect(result.originalColor).toBeDefined();
        expect(result.adjustedColor).toBeDefined();
        expect(result.contrastRatio).toBeGreaterThan(0);
      }
    });

    it('에러가 발생하면 null을 반환해야 한다', async () => {
      // Mock getComputedStyle to throw error
      mockGetComputedStyle.mockImplementation(() => {
        throw new Error('Computed style error');
      });

      const result = await autoContrast.adjustElement(mockElement);
      expect(result).toBeNull();
    });
  });

  describe('analyzeBackground 메서드', () => {
    it('단색 배경을 분석할 수 있어야 한다', async () => {
      const analysis = await autoContrast.analyzeBackground(mockElement);

      expect(analysis).toBeDefined();
      expect(analysis.averageColor).toBeDefined();
      expect(analysis.luminance).toBeGreaterThanOrEqual(0);
      expect(analysis.luminance).toBeLessThanOrEqual(1);
      expect(typeof analysis.isLight).toBe('boolean');
      expect(typeof analysis.isDark).toBe('boolean');
    });
  });
});

