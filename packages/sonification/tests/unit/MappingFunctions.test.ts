import SonificationEngine from '../../src/core/SonificationEngine';

describe('MappingFunctions', () => {
  let engine: SonificationEngine;

  beforeEach(() => {
    engine = new SonificationEngine();
  });

  describe('mapValueToFrequency', () => {
    it('0 값을 최소 주파수로 매핑해야 한다', () => {
      const frequency = (engine as any).mapValueToFrequency(0);
      expect(frequency).toBe(150);
    });

    it('1 값을 최대 주파수로 매핑해야 한다', () => {
      const frequency = (engine as any).mapValueToFrequency(1);
      expect(frequency).toBe(1500);
    });

    it('0.5 값을 중간 주파수로 매핑해야 한다', () => {
      const frequency = (engine as any).mapValueToFrequency(0.5);
      expect(frequency).toBe(825);
    });

    it('범위를 벗어난 값을 클램핑해야 한다', () => {
      const negativeFreq = (engine as any).mapValueToFrequency(-1);
      const overFreq = (engine as any).mapValueToFrequency(2);

      expect(negativeFreq).toBe(150);
      expect(overFreq).toBe(1500);
    });
  });

  describe('mapValueToVolume 메서드', () => {
    it('0 값을 최소 볼륨으로 매핑해야 한다', () => {
      const volume = (engine as any).mapValueToVolume(0);
      expect(volume).toBe(0.1);
    });

    it('1 값을 최대 볼륨으로 매핑해야 한다', () => {
      const volume = (engine as any).mapValueToVolume(1);
      expect(volume).toBe(0.5);
    });

    it('0.5 값을 중간 볼륨으로 매핑해야 한다', () => {
      const volume = (engine as any).mapValueToVolume(0.5);
      expect(volume).toBeCloseTo(0.3, 10);
    });
  });

  describe('mapValueToNote 메서드', () => {
    it('7음계 주파수를 반환해야 한다', () => {
      const notes = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88];

      for (let i = 0; i < 7; i++) {
        const value = i / 7;
        const note = (engine as any).mapValueToNote(value);
        expect(note).toBe(notes[i]);
      }
    });

    it('0 값을 도(C)로 매핑해야 한다', () => {
      const note = (engine as any).mapValueToNote(0);
      expect(note).toBe(261.63);
    });

    it('1 값을 시(B)로 매핑해야 한다', () => {
      const note = (engine as any).mapValueToNote(1);
      expect(note).toBe(493.88);
    });
  });

  describe('mapValueToInterval 메서드', () => {
    it('0 값을 최대 간격으로 매핑해야 한다', () => {
      const interval = (engine as any).mapValueToInterval(0);
      expect(interval).toBe(1.0);
    });

    it('1 값을 최소 간격으로 매핑해야 한다', () => {
      const interval = (engine as any).mapValueToInterval(1);
      expect(interval).toBe(0.1);
    });

    it('0.5 값을 중간 간격으로 매핑해야 한다', () => {
      const interval = (engine as any).mapValueToInterval(0.5);
      expect(interval).toBe(0.55);
    });
  });

  describe('mapValueToNoteName 메서드', () => {
    it('7음계 이름을 반환해야 한다', () => {
      const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

      for (let i = 0; i < 7; i++) {
        const value = i / 7;
        const noteName = (engine as any).mapValueToNoteName(value);
        expect(noteName).toBe(noteNames[i]);
      }
    });

    it('0 값을 C로 매핑해야 한다', () => {
      const noteName = (engine as any).mapValueToNoteName(0);
      expect(noteName).toBe('C');
    });

    it('1 값을 B로 매핑해야 한다', () => {
      const noteName = (engine as any).mapValueToNoteName(1);
      expect(noteName).toBe('B');
    });
  });
});
