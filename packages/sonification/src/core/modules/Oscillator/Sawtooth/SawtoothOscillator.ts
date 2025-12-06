import type { OscillatorStrategy } from '..';

export default class SawtoothOscillator implements OscillatorStrategy {
  getSample(frequency: number, time: number): number {
    const period = 1 / frequency;
    const t = time % period;
    return (2 * t) / period - 1;
  }
}
