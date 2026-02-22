import type { HapticSequence } from '../types';
import { BaseGenerator } from './BaseGenerator';

const DEFAULT_MIN_DURATION = 50;
const DEFAULT_MAX_DURATION = 400;
const DEFAULT_PAUSE = 80;

export class WaveGenerator extends BaseGenerator {
  generate(normalized: number[]): HapticSequence {
    const minDuration = this.config.duration?.min ?? DEFAULT_MIN_DURATION;
    const maxDuration = this.config.duration?.max ?? DEFAULT_MAX_DURATION;
    const pause = DEFAULT_PAUSE;

    return normalized.map((value) => ({
      intensity: value,
      duration: this.lerp(value, minDuration, maxDuration),
      pause,
    }));
  }
}
