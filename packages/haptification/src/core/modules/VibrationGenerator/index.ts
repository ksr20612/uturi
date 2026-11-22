import type { HaptifierConfig, HaptifierMethod, HapticSequence } from '../../../typings/haptifier';
import { PulseVibrationGenerator } from './Pulse/PulseVibrationGenerator';
import { RhythmVibrationGenerator } from './Rhythm/RhythmVibrationGenerator';
import { WaveVibrationGenerator } from './Wave/WaveVibrationGenerator';

export default class VibrationGenerator {
  private strategy: VibrationGeneratorStrategy;

  constructor(method: HaptifierMethod) {
    switch (method) {
      case 'pulse':
        this.strategy = new PulseVibrationGenerator();
        break;
      case 'wave':
        this.strategy = new WaveVibrationGenerator();
        break;
      case 'rhythm':
      default:
        this.strategy = new RhythmVibrationGenerator();
        break;
    }
  }

  generate(normalized: number[], config: HaptifierConfig): HapticSequence {
    if (normalized.length === 0) return [];
    return this.strategy.generate(normalized, config);
  }
}

export interface VibrationGeneratorStrategy {
  generate(normalized: number[], config: HaptifierConfig): HapticSequence;
}
