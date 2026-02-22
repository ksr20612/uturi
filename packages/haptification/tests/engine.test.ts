import { createHapticEngine } from '../src/core/engine';
import type { VibrationDriver, HapticSequence } from '../src/core/types';

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

describe('createHapticEngine', () => {
  it('기본 method는 rhythm이다', () => {
    const driver = createMockDriver();
    const engine = createHapticEngine({ driver });
    const seq = engine.toSequence([10, 50, 30]);
    expect(seq.length).toBe(3);
  });

  it('isSupported()는 driver에 위임한다', () => {
    expect(createHapticEngine({ driver: createMockDriver(true) }).isSupported()).toBe(true);
    expect(createHapticEngine({ driver: createMockDriver(false) }).isSupported()).toBe(false);
  });

  it('play()는 driver.play()를 호출한다', async () => {
    const driver = createMockDriver();
    const engine = createHapticEngine({ driver });
    await engine.play([10, 50, 30]);
    expect(driver.lastSequence).not.toBeNull();
  });

  it('지원하지 않는 driver에서 play()는 조용히 no-op이다', async () => {
    const driver = createMockDriver(false);
    const engine = createHapticEngine({ driver });
    await expect(engine.play([10, 50])).resolves.toBeUndefined();
    expect(driver.lastSequence).toBeNull();
  });

  it('playSequence()는 주어진 시퀀스를 그대로 실행한다', async () => {
    const driver = createMockDriver();
    const engine = createHapticEngine({ driver });
    const custom: HapticSequence = [{ intensity: 0.5, duration: 100, pause: 50 }];
    await engine.playSequence(custom);
    expect(driver.lastSequence).toEqual(custom);
  });

  it('빈 데이터는 빈 시퀀스를 생성한다', () => {
    const engine = createHapticEngine({ driver: createMockDriver() });
    expect(engine.toSequence([])).toEqual([]);
  });

  it('pulse method는 rhythm보다 더 많은 프레임을 생성할 수 있다', () => {
    // pulse는 높은 값마다 여러 프레임을 생성하므로 항상 1프레임인 rhythm보다 많다
    const pulseEngine = createHapticEngine({ driver: createMockDriver(), method: 'pulse' });
    const rhythmEngine = createHapticEngine({ driver: createMockDriver(), method: 'rhythm' });
    const data = [0, 100, 50, 80];
    expect(pulseEngine.toSequence(data).length).toBeGreaterThan(
      rhythmEngine.toSequence(data).length,
    );
  });
});
