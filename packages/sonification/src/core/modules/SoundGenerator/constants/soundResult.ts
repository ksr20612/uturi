import type { SoundGenerationResult } from '..';

export function createEmptySoundResult(): SoundGenerationResult {
  return {
    audioData: new Float32Array(0),
    dataPoints: [],
  };
}
