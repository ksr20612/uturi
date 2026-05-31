import type { HapticFrame, HapticSequence, HaptifierConfig } from '../typings/haptifier';
import Haptifier from './Haptifier';

export function pulse(options: {
  intensity: number;
  duration: number;
  pause?: number;
}): HapticFrame {
  return {
    intensity: Math.max(0, Math.min(1, options.intensity)),
    duration: options.duration,
    pause: options.pause ?? 0,
  };
}

export function wave(options: {
  intensity: number;
  duration: number;
  pause?: number;
}): HapticFrame {
  return {
    intensity: Math.max(0, Math.min(1, options.intensity)),
    duration: options.duration,
    pause: options.pause ?? 0,
  };
}

export function silence(duration: number): HapticFrame {
  return { intensity: 0, duration: 0, pause: duration };
}

export function sequence(parts: Array<HapticSequence | HapticFrame>): HapticSequence {
  return parts.flatMap((part) => (Array.isArray(part) ? part : [part]));
}

export function haptify(data: number[], config?: Omit<HaptifierConfig, 'driver'>): void {
  new Haptifier(config).play(data);
}

export function toHapticSequence(
  data: number[],
  config?: Omit<HaptifierConfig, 'driver'>,
): HapticSequence {
  return new Haptifier(config).haptify(data);
}
