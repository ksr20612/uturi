export type {
  HapticFrame,
  HapticSequence,
  HapticMethod,
  HapticRangeConfig,
  HapticConfig,
  VibrationDriver,
  HapticEngine,
} from './types';

export { createHapticEngine } from './engine';
export { WebDriver } from './drivers/WebDriver';
export { pulse, wave, silence, sequence } from './primitives';

import type { HapticConfig, HapticSequence } from './types';
import { createHapticEngine } from './engine';

export function haptify(data: number[], config?: Omit<HapticConfig, 'driver'>): void {
  createHapticEngine(config).play(data);
}

export function toHapticSequence(
  data: number[],
  config?: Omit<HapticConfig, 'driver'>,
): HapticSequence {
  return createHapticEngine(config).toSequence(data);
}
