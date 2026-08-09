import type { HaptifierConfig } from '../typings/haptifier';

const DEFAULT_CONFIG = Object.freeze({
  method: 'rhythm',
  duration: { min: 50, max: 400 },
  pause: { min: 50, max: 500 },
} as const satisfies Required<Omit<HaptifierConfig, 'driver'>>);

export default DEFAULT_CONFIG;
