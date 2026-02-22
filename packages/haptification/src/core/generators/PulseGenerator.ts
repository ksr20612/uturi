import type { HapticSequence } from '../types';
import { BaseGenerator } from './BaseGenerator';

const MAX_PULSES = 5;
const PULSE_DURATION = 50;
const PULSE_INNER_PAUSE = 30;
const PULSE_GAP = 150;

export class PulseGenerator extends BaseGenerator {
  generate(normalized: number[]): HapticSequence {
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
