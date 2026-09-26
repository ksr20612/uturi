import type { HaptifierConfig, HapticSequence } from '../../../../typings/haptifier';
import { BaseVibrationGenerator } from '../BaseVibrationGenerator';
import DEFAULT_CONFIG from '../../../../constants/defaultConfig';

const DEFAULT_PAUSE = 80;

export class WaveVibrationGenerator extends BaseVibrationGenerator {
  generate(normalized: number[], config: HaptifierConfig): HapticSequence {
    const minDuration = config.duration?.min ?? DEFAULT_CONFIG.duration.min;
    const maxDuration = config.duration?.max ?? DEFAULT_CONFIG.duration.max;
    const pause = DEFAULT_PAUSE;

    return normalized.map((value) => ({
      intensity: value,
      duration: this.lerp(value, minDuration, maxDuration),
      pause,
    }));
  }
}
