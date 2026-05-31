import Haptifier from '../src/core/Haptifier';
import type { VibrationDriver, HapticSequence } from '../src/typings/haptifier';

function createMockDriver(
  supported = true,
): VibrationDriver & { lastSequence: HapticSequence | null } {
  return {
    lastSequence: null,
    isSupported: () => supported,
    async play(sequence) {
      this.lastSequence = sequence;
    },
    stop() {},
  };
}

describe('Haptifier', () => {
  it('기본 method는 rhythm이다', () => {
    const haptifier = new Haptifier({ driver: createMockDriver() });
    const seq = haptifier.haptify([10, 50, 30]);
    expect(seq.length).toBe(3);
  });

  it('isSupported()는 driver에 위임한다', () => {
    expect(new Haptifier({ driver: createMockDriver(true) }).isSupported()).toBe(true);
    expect(new Haptifier({ driver: createMockDriver(false) }).isSupported()).toBe(false);
  });

  it('play()는 driver.play()를 호출한다', async () => {
    const driver = createMockDriver();
    const haptifier = new Haptifier({ driver });
    await haptifier.play([10, 50, 30]);
    expect(driver.lastSequence).not.toBeNull();
  });

  it('지원하지 않는 driver에서 play()는 조용히 no-op이다', async () => {
    const driver = createMockDriver(false);
    const haptifier = new Haptifier({ driver });
    await expect(haptifier.play([10, 50])).resolves.toBeUndefined();
    expect(driver.lastSequence).toBeNull();
  });

  it('playSequence()는 주어진 시퀀스를 그대로 실행한다', async () => {
    const driver = createMockDriver();
    const haptifier = new Haptifier({ driver });
    const custom: HapticSequence = [{ intensity: 0.5, duration: 100, pause: 50 }];
    await haptifier.playSequence(custom);
    expect(driver.lastSequence).toEqual(custom);
  });

  it('빈 데이터는 빈 시퀀스를 생성한다', () => {
    const haptifier = new Haptifier({ driver: createMockDriver() });
    expect(haptifier.haptify([])).toEqual([]);
  });

  it('pulse method는 rhythm보다 더 많은 프레임을 생성할 수 있다', () => {
    const pulseHaptifier = new Haptifier({ driver: createMockDriver(), method: 'pulse' });
    const rhythmHaptifier = new Haptifier({ driver: createMockDriver(), method: 'rhythm' });
    const data = [0, 100, 50, 80];
    expect(pulseHaptifier.haptify(data).length).toBeGreaterThan(
      rhythmHaptifier.haptify(data).length,
    );
  });
});
