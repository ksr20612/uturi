import type { SoundGenerationResult } from '..';
import type { SonifierConfig, DataPoint } from '../../../../typings/sonifier';
import type Oscillator from '../../Oscillator';
import { BaseSoundGenerator } from '../BaseSoundGenerator';

export class FrequencySoundGenerator extends BaseSoundGenerator {
  generate(
    data: number[],
    config: Required<SonifierConfig>,
    oscillator: Oscillator,
  ): SoundGenerationResult {
    const bufferLength = config.sampleRate * config.duration;
    const audioData = new Float32Array(bufferLength);
    const timeStep = config.duration / data.length;

    // 데이터 범위 계산 (캐싱)
    const cache = this.calculateDataRange(data);

    const dataPoints: DataPoint[] = data.map((value, index) => {
      const normalizedValue = this.normalizeValue(value, data, cache);
      return {
        value,
        timestamp: index * timeStep,
        volume: this.mapValueToVolume(config, normalizedValue),
        frequency: this.mapValueToFrequency(config, normalizedValue),
      };
    });

    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      const normalizedValue = this.normalizeValue(value, data, cache);
      const startSample = Math.floor(i * timeStep * config.sampleRate);
      const endSample = Math.floor((i + 1) * timeStep * config.sampleRate);

      const frequency = this.mapValueToFrequency(config, normalizedValue);

      for (let sample = startSample; sample < endSample && sample < audioData.length; sample++) {
        const time = sample / config.sampleRate;
        const localTime = time - i * timeStep;
        audioData[sample] = oscillator.oscillate(frequency, localTime) * config.volume;
      }
    }

    return { audioData, dataPoints };
  }
}
