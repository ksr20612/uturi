import type { WaveType } from '../../../typings/sonifier';
import SawtoothOscillator from './Sawtooth/SawtoothOscillator';
import SineOscillator from './Sine/SineOscillator';
import SquareOscillator from './Square/SquareOscillator';

export default class Oscillator {
  private strategy: OscillatorStrategy;

  /*
    TODO
    현재는 각 Oscillator의 동작이 복잡하지 않아서 트리셰이킹 등을 고려해 의존성을 외부에서 주입하는 방식으로 구현되어 있지 않음
    이후 동작이 복잡해지면 의존성을 외부에서 주입하는 방식으로 구현해야 할 수 있음
  */
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

export interface OscillatorStrategy {
  getSample(frequency: number, time: number): number;
}
