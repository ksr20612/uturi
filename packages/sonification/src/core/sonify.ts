import { SonificationConfig } from '../typings/sonification';
import SonificationEngine from './SonificationEngine';

export default async function sonifyArray(
  values: number[],
  method: 'frequency' | 'volume' | 'rhythm' | 'melody' = 'frequency',
  config?: SonificationConfig,
) {
  const engine = new SonificationEngine(config);
  const result = await engine.sonify(values, method);

  engine.play(result.audioBuffer);

  return {
    audioBuffer: result.audioBuffer,
    duration: result.duration,
    dataPoints: result.dataPoints,
  };
}
