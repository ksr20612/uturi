import type { HaptifierConfig, HapticSequence } from '../../../../typings/haptifier';
import { BaseVibrationGenerator } from '../BaseVibrationGenerator';

const MAX_PULSES = 5;
const PULSE_DURATION = 50;
const PULSE_INNER_PAUSE = 30;
const PULSE_GAP = 150;

export class PulseVibrationGenerator extends BaseVibrationGenerator {
  generate(normalized: number[], _config: HaptifierConfig): HapticSequence {
    const frames: HapticSequence = [];

    for (const value of normalized) {
      const pulseCount = Math.max(1, Math.round(value * MAX_PULSES));

      for (let p = 0; p < pulseCount; p++) {
        const isLastPulse = p === pulseCount - 1;
        frames.push({
          intensity: value,
          duration: PULSE_DURATION,
          pause: isLastPulse ? PULSE_GAP : PULSE_INNER_PAUSE,
        });
      }
    }

    return frames;
  }
}
