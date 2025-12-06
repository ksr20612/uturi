import type { SoundGenerationResult } from '..';
import type { SonifierConfig, DataPoint } from '../../../../typings/sonification';
import type Oscillator from '../../Oscillator';
import { BaseSoundGenerator } from '../BaseSoundGenerator';

export class VolumeSoundGenerator extends BaseSoundGenerator {
  generate(
    data: number[],
    config: Required<SonifierConfig>,
    oscillator: Oscillator,
  ): SoundGenerationResult {
    const bufferLength = config.sampleRate * config.duration;
    const audioData = new Float32Array(bufferLength);
    const timeStep = config.duration / data.length;
    const baseFrequency = config.frequency;

    // 데이터 범위 계산 (캐싱)
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const cache = { min, max, range };

    const dataPoints: DataPoint[] = data.map((value, index) => {
      const normalizedValue = this.normalizeValue(value, data, cache);
      return {
        value,
        timestamp: index * timeStep,
        volume: this.mapValueToVolume(config, normalizedValue),
        frequency: baseFrequency, // Volume uses constant base frequency
      };
    });

    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      const normalizedValue = this.normalizeValue(value, data, cache);
      const startSample = Math.floor(i * timeStep * config.sampleRate);
      const endSample = Math.floor((i + 1) * timeStep * config.sampleRate);

      const volume = this.mapValueToVolume(config, normalizedValue);

      for (let sample = startSample; sample < endSample && sample < audioData.length; sample++) {
        const timePosition = sample / config.sampleRate;
        const localTime = timePosition - i * timeStep;
        audioData[sample] = oscillator.oscillate(baseFrequency, localTime) * volume;
      }
    }

    return { audioData, dataPoints };
  }
}
