import type { HaptifierConfig, HapticSequence } from '../../../typings/haptifier';

export abstract class BaseVibrationGenerator {
  abstract generate(normalized: number[], config: HaptifierConfig): HapticSequence;

  protected lerp(value: number, min: number, max: number): number {
    return min + value * (max - min);
  }
}
