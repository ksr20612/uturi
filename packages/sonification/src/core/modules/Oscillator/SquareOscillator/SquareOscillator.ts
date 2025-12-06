import type { OscillatorStrategy } from '..';

export default class SquareOscillator implements OscillatorStrategy {
  getSample(frequency: number, time: number): number {
    return Math.sign(Math.sin(2 * Math.PI * frequency * time));
  }
}
