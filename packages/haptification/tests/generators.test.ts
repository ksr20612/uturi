import { PulseGenerator } from '../src/core/generators/PulseGenerator';
import { RhythmGenerator } from '../src/core/generators/RhythmGenerator';
import { WaveGenerator } from '../src/core/generators/WaveGenerator';

describe('PulseGenerator', () => {
  const generator = new PulseGenerator({});

  it('빈 배열은 빈 시퀀스를 반환한다', () => {
    expect(generator.generate([])).toEqual([]);
  });

  it('값이 0이면 1개의 펄스를 생성한다', () => {
    const seq = generator.generate([0]);
    expect(seq.length).toBe(1);
  });

  it('값이 높을수록 더 많은 펄스를 생성한다', () => {
    const lowSeq = generator.generate([0.1]);
    const highSeq = generator.generate([0.9]);
    expect(highSeq.length).toBeGreaterThan(lowSeq.length);
  });

  it('모든 프레임의 intensity가 데이터 값과 일치한다', () => {
    const seq = generator.generate([0.5]);
    seq.forEach((frame) => {
      expect(frame.intensity).toBeCloseTo(0.5);
    });
  });
});

describe('RhythmGenerator', () => {
  const generator = new RhythmGenerator({});

  it('각 데이터 포인트마다 정확히 1개의 프레임을 생성한다', () => {
    const seq = generator.generate([0.2, 0.5, 0.8]);
    expect(seq.length).toBe(3);
  });

  it('값이 높을수록 pause가 짧다 (빠른 리듬)', () => {
    const [lowFrame] = generator.generate([0.1]);
    const [highFrame] = generator.generate([0.9]);
    expect(lowFrame.pause).toBeGreaterThan(highFrame.pause);
  });

  it('duration은 일정하다', () => {
    const seq = generator.generate([0.1, 0.5, 0.9]);
    const durations = seq.map((f) => f.duration);
    expect(new Set(durations).size).toBe(1);
  });
});

describe('WaveGenerator', () => {
  const generator = new WaveGenerator({});

  it('각 데이터 포인트마다 정확히 1개의 프레임을 생성한다', () => {
    const seq = generator.generate([0.2, 0.5, 0.8]);
    expect(seq.length).toBe(3);
  });

  it('값이 높을수록 duration이 길다', () => {
    const [lowFrame] = generator.generate([0.1]);
    const [highFrame] = generator.generate([0.9]);
    expect(highFrame.duration).toBeGreaterThan(lowFrame.duration);
  });

  it('intensity가 데이터 값과 일치한다', () => {
    const [frame] = generator.generate([0.7]);
    expect(frame.intensity).toBeCloseTo(0.7);
  });

  it('pause는 일정하다', () => {
    const seq = generator.generate([0.1, 0.5, 0.9]);
    const pauses = seq.map((f) => f.pause);
    expect(new Set(pauses).size).toBe(1);
  });
});
