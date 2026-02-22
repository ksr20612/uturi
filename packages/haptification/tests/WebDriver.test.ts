import { WebDriver } from '../src/core/drivers/WebDriver';
import type { HapticSequence } from '../src/core/types';

describe('WebDriver', () => {
  let vibrateMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vibrateMock = vi.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: vibrateMock,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('isSupported()는 navigator.vibrate 존재 시 true를 반환한다', () => {
    const driver = new WebDriver();
    expect(driver.isSupported()).toBe(true);
  });

  it('play()는 올바른 패턴으로 navigator.vibrate를 호출한다', async () => {
    const driver = new WebDriver();
    const sequence: HapticSequence = [
      { intensity: 0.5, duration: 100, pause: 50 },
      { intensity: 0.8, duration: 200, pause: 0 },
    ];
    await driver.play(sequence);
    expect(vibrateMock).toHaveBeenCalledWith([100, 50, 200]);
  });

  it('빈 시퀀스는 navigator.vibrate를 호출하지 않는다', async () => {
    const driver = new WebDriver();
    await driver.play([]);
    expect(vibrateMock).not.toHaveBeenCalled();
  });

  it('stop()은 navigator.vibrate(0)을 호출한다', () => {
    const driver = new WebDriver();
    driver.stop();
    expect(vibrateMock).toHaveBeenCalledWith(0);
  });

  it('trailing pause 0은 패턴에서 제거된다', async () => {
    const driver = new WebDriver();
    const sequence: HapticSequence = [{ intensity: 0.5, duration: 100, pause: 0 }];
    await driver.play(sequence);
    expect(vibrateMock).toHaveBeenCalledWith([100]);
  });
});
