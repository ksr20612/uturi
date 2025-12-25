import type { SoundGenerationResult } from '..';

export const EMPTY_SOUND_RESULT: SoundGenerationResult = Object.freeze({
  audioData: new Float32Array(0),
  dataPoints: [],
});
