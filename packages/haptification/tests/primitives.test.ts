import { pulse, wave, silence, sequence } from '../src/core/primitives';

describe('pulse()', () => {
  it('올바른 HapticFrame을 생성한다', () => {
    const frame = pulse({ intensity: 0.8, duration: 100 });
    expect(frame).toEqual({ intensity: 0.8, duration: 100, pause: 0 });
  });

  it('intensity는 0-1로 클램핑된다', () => {
    expect(pulse({ intensity: 1.5, duration: 100 }).intensity).toBe(1);
    expect(pulse({ intensity: -0.5, duration: 100 }).intensity).toBe(0);
  });

  it('pause 옵션이 적용된다', () => {
    const frame = pulse({ intensity: 0.5, duration: 100, pause: 50 });
    expect(frame.pause).toBe(50);
  });
});

describe('wave()', () => {
  it('올바른 HapticFrame을 생성한다', () => {
    const frame = wave({ intensity: 0.6, duration: 200 });
    expect(frame).toEqual({ intensity: 0.6, duration: 200, pause: 0 });
  });
});

describe('silence()', () => {
  it('duration=0, 주어진 값을 pause로 하는 프레임을 생성한다', () => {
    const frame = silence(100);
    expect(frame).toEqual({ intensity: 0, duration: 0, pause: 100 });
  });
});

describe('sequence()', () => {
  it('단일 프레임 배열을 병합한다', () => {
    const f1 = pulse({ intensity: 0.5, duration: 100 });
    const f2 = silence(50);
    const seq = sequence([f1, f2]);
    expect(seq).toEqual([f1, f2]);
  });
});
