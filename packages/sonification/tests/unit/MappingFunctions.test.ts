/* eslint-disable @typescript-eslint/no-explicit-any */

import { MelodySoundGenerator } from '../../src/core/modules/SoundGenerator/Melody/MelodySoundGenerator';
import defaultConfig from '../../src/constants/defaultConfig';
import type { SonifierConfig } from '../../src/typings/sonification';
import type { BaseSoundGenerator } from '../../src/core/modules/SoundGenerator/BaseSoundGenerator';

// TODO: 테스트 전략 수정 필요(기능 별로 구체적으로 쪼개기)
describe('MappingFunctions', () => {
  let generator: BaseSoundGenerator;
  const config = { ...defaultConfig } as Required<SonifierConfig>;

  beforeEach(() => {
    generator = new MelodySoundGenerator();
  });

  describe('mapValueToFrequency', () => {
    it('0 값을 최소 주파수로 매핑해야 한다', () => {
      const frequency = (generator as any).mapValueToFrequency(config, 0);
      expect(frequency).toBe(150);
    });

    it('1 값을 최대 주파수로 매핑해야 한다', () => {
      const frequency = (generator as any).mapValueToFrequency(config, 1);
      expect(frequency).toBe(1500);
    });

    it('0.5 값을 중간 주파수로 매핑해야 한다', () => {
      const frequency = (generator as any).mapValueToFrequency(config, 0.5);
      expect(frequency).toBe(825);
    });

    it('범위를 벗어난 값을 클램핑해야 한다', () => {
      const negativeFreq = (generator as any).mapValueToFrequency(config, -1);
      const overFreq = (generator as any).mapValueToFrequency(config, 2);

      expect(negativeFreq).toBe(-1200);
      expect(overFreq).toBe(2850);
    });
  });

  describe('mapValueToVolume 메서드', () => {
    it('0 값을 최소 볼륨으로 매핑해야 한다', () => {
      const volume = (generator as any).mapValueToVolume(config, 0);
      expect(volume).toBe(0.1);
    });

    it('1 값을 최대 볼륨으로 매핑해야 한다', () => {
      const volume = (generator as any).mapValueToVolume(config, 1);
      expect(volume).toBe(0.5);
    });

    it('0.5 값을 중간 볼륨으로 매핑해야 한다', () => {
      const volume = (generator as any).mapValueToVolume(config, 0.5);
      expect(volume).toBeCloseTo(0.3, 10);
    });
  });

  describe('mapValueToNote 메서드', () => {
    it('7음계 주파수를 반환해야 한다', () => {
      const notes = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88];

      for (let i = 0; i < 7; i++) {
        const value = i / 7;
        const note = (generator as any).mapValueToNote(value);
        expect(note).toBe(notes[i]);
      }
    });

    it('0 값을 도(C)로 매핑해야 한다', () => {
      const note = (generator as any).mapValueToNote(0);
      expect(note).toBe(261.63);
    });

    it('1 값을 시(B)로 매핑해야 한다', () => {
      // 1.0 입력 시 index = floor(1.0 * 7) = 7 -> min(7, 6) = 6 (B)
      const note = (generator as any).mapValueToNote(1);
      expect(note).toBe(493.88);
    });
  });

  describe('mapValueToInterval 메서드', () => {
    it('0 값을 최대 간격으로 매핑해야 한다', () => {
      const interval = (generator as any).mapValueToInterval(config, 0);
      expect(interval).toBe(1.0);
    });

    it('1 값을 최소 간격으로 매핑해야 한다', () => {
      const interval = (generator as any).mapValueToInterval(config, 1);
      expect(interval).toBe(0.1);
    });

    it('0.5 값을 중간 간격으로 매핑해야 한다', () => {
      const interval = (generator as any).mapValueToInterval(config, 0.5);
      expect(interval).toBe(0.55);
    });
  });

  describe('mapValueToNoteName 메서드', () => {
    it('7음계 이름을 반환해야 한다', () => {
      const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

      for (let i = 0; i < 7; i++) {
        const value = i / 7;
        const noteName = (generator as any).mapValueToNoteName(value);
        expect(noteName).toBe(noteNames[i]);
      }
    });

    it('0 값을 C로 매핑해야 한다', () => {
      const noteName = (generator as any).mapValueToNoteName(0);
      expect(noteName).toBe('C');
    });

    it('1 값을 B로 매핑해야 한다', () => {
      const noteName = (generator as any).mapValueToNoteName(1);
      expect(noteName).toBe('B');
    });
  });
});
