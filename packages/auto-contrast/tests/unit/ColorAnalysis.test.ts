import { describe, it, expect, beforeEach } from 'vitest';
import AutoContrast from '../../src/core/AutoContrast';

describe('ColorAnalysis', () => {
  let autoContrast: AutoContrast;

  beforeEach(() => {
    autoContrast = new AutoContrast({ autoLaunch: false });
  });

  describe('calculateContrastRatio', () => {
    it('검은색과 흰색의 대비율을 정확히 계산해야 한다', () => {
      const ratio = (autoContrast as any).calculateContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeCloseTo(21, 1);
    });

    it('같은 색상의 대비율은 1이어야 한다', () => {
      const ratio = (autoContrast as any).calculateContrastRatio('#FF0000', '#FF0000');
      expect(ratio).toBe(1);
    });

    it('중간 대비율을 정확히 계산해야 한다', () => {
      const ratio = (autoContrast as any).calculateContrastRatio('#666666', '#FFFFFF');
      expect(ratio).toBeGreaterThan(1);
      expect(ratio).toBeLessThan(21);
    });
  });

  describe('getLuminance', () => {
    it('검은색의 휘도는 0이어야 한다', () => {
      const luminance = (autoContrast as any).getLuminance('#000000');
      expect(luminance).toBe(0);
    });

    it('흰색의 휘도는 1이어야 한다', () => {
      const luminance = (autoContrast as any).getLuminance('#FFFFFF');
      expect(luminance).toBe(1);
    });

    it('회색의 휘도는 0.5에 가까워야 한다', () => {
      const luminance = (autoContrast as any).getLuminance('#808080');
      expect(luminance).toBeCloseTo(0.5, 1);
    });
  });

  describe('calculateLuminance', () => {
    it('RGB 휘도를 정확히 계산해야 한다', () => {
      const luminance = (autoContrast as any).calculateLuminance(255, 255, 255);
      expect(luminance).toBe(1);
    });

    it('검은색 RGB의 휘도는 0이어야 한다', () => {
      const luminance = (autoContrast as any).calculateLuminance(0, 0, 0);
      expect(luminance).toBe(0);
    });
  });

  describe('hexToRgb', () => {
    it('유효한 hex 색상을 RGB로 변환해야 한다', () => {
      const rgb = (autoContrast as any).hexToRgb('#FF0000');
      expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('# 없이도 변환해야 한다', () => {
      const rgb = (autoContrast as any).hexToRgb('FF0000');
      expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('잘못된 형식에 대해 null을 반환해야 한다', () => {
      const rgb = (autoContrast as any).hexToRgb('invalid');
      expect(rgb).toBeNull();
    });
  });

  describe('rgbToHex', () => {
    it('RGB를 hex로 변환해야 한다', () => {
      const hex = (autoContrast as any).rgbToHex(255, 0, 0);
      expect(hex).toBe('#ff0000');
    });

    it('0 값도 정확히 변환해야 한다', () => {
      const hex = (autoContrast as any).rgbToHex(0, 0, 0);
      expect(hex).toBe('#000000');
    });
  });

  describe('rgbToHsl', () => {
    it('RGB를 HSL로 변환해야 한다', () => {
      const hsl = (autoContrast as any).rgbToHsl(255, 0, 0);
      expect(hsl.h).toBeCloseTo(0, 1);
      expect(hsl.s).toBeCloseTo(100, 1);
      expect(hsl.l).toBeCloseTo(50, 1);
    });

    it('회색의 HSL을 정확히 계산해야 한다', () => {
      const hsl = (autoContrast as any).rgbToHsl(128, 128, 128);
      expect(hsl.s).toBeCloseTo(0, 1);
      expect(hsl.l).toBeCloseTo(50, 1);
    });
  });

  describe('parseRgbColor', () => {
    it('RGB 문자열을 파싱해야 한다', () => {
      const rgb = (autoContrast as any).parseRgbColor('rgb(255, 0, 0)');
      expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('공백이 있는 RGB 문자열도 파싱해야 한다', () => {
      const rgb = (autoContrast as any).parseRgbColor('rgb( 255 , 0 , 0 )');
      expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('잘못된 형식에 대해 기본값을 반환해야 한다', () => {
      const rgb = (autoContrast as any).parseRgbColor('invalid');
      expect(rgb).toEqual({ r: 0, g: 0, b: 0 });
    });
  });
});

