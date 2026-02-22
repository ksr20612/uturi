export { default as Haptifier } from './Haptifier';
export { HaptificationError, ERROR_CODES } from './errors';
export type { HaptificationErrorCode } from './errors';
export { pulse, wave, silence, sequence, haptify, toHapticSequence } from './primitives';
export { WebVibrationDriver } from './modules';

export type {
  HaptifierConfig,
  HaptifierMethod,
  HapticFrame,
  HapticSequence,
  HapticRangeConfig,
  VibrationDriver,
} from '../typings/haptifier';
