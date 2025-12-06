import type { WaveType } from '../../../typings/sonification';
import SawtoothOscillator from './SawtoothOscillator/SawtoothOscillator';
import SineOscillator from './SineOscillator/SineOscillator';
import SquareOscillator from './SquareOscillator/SquareOscillator';

export interface OscillatorStrategy {
  getSample(frequency: number, time: number): number;
}

export default class Oscillator {
  private strategy: OscillatorStrategy;

  constructor(type: WaveType) {
    switch (type) {
      case 'square':
        this.strategy = new SquareOscillator();
        break;
      case 'sawtooth':
        this.strategy = new SawtoothOscillator();
        break;
      case 'sine':
      default:
        this.strategy = new SineOscillator();
        break;
    }
  }

  oscillate(frequency: number, time: number) {
    return this.strategy.getSample(frequency, time);
  }
}
