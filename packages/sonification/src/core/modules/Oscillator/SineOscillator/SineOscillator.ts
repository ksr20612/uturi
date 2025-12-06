import type { OscillatorStrategy } from '..';

export default class SineOscillator implements OscillatorStrategy {
  getSample(frequency: number, time: number): number {
    return Math.sin(2 * Math.PI * frequency * time);
  }
}
