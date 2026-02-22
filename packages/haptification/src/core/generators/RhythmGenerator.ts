import type { HapticSequence } from '../types';
import { BaseGenerator } from './BaseGenerator';

const DEFAULT_DURATION = 100;
const DEFAULT_MIN_PAUSE = 50;
const DEFAULT_MAX_PAUSE = 500;

export class RhythmGenerator extends BaseGenerator {
  generate(normalized: number[]): HapticSequence {
    const duration = DEFAULT_DURATION;
    const minPause = this.config.pause?.min ?? DEFAULT_MIN_PAUSE;
    const maxPause = this.config.pause?.max ?? DEFAULT_MAX_PAUSE;

    return normalized.map((value) => ({
      intensity: value,
      duration,
      pause: this.lerp(1 - value, minPause, maxPause),
    }));
  }
}
