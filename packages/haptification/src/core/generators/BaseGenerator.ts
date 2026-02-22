import type { HapticConfig, HapticSequence } from '../types';

export abstract class BaseGenerator {
  constructor(protected readonly config: HapticConfig) {}

  abstract generate(normalized: number[]): HapticSequence;

  protected lerp(value: number, min: number, max: number): number {
    return min + value * (max - min);
  }
}
