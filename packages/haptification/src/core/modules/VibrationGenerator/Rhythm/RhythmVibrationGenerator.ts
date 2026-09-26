import type { HaptifierConfig, HapticSequence } from '../../../../typings/haptifier';
import { BaseVibrationGenerator } from '../BaseVibrationGenerator';
import DEFAULT_CONFIG from '../../../../constants/defaultConfig';

const DEFAULT_DURATION = 100;

export class RhythmVibrationGenerator extends BaseVibrationGenerator {
  generate(normalized: number[], config: HaptifierConfig): HapticSequence {
    const duration = DEFAULT_DURATION;
    const minPause = config.pause?.min ?? DEFAULT_CONFIG.pause.min;
    const maxPause = config.pause?.max ?? DEFAULT_CONFIG.pause.max;

    return normalized.map((value) => ({
      intensity: value,
      duration,
      pause: this.lerp(1 - value, minPause, maxPause),
    }));
  }
}
