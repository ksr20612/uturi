import type { SoundGenerationResult } from '..';
import type { SonifierConfig, DataPoint } from '../../../../typings/sonification';
import type Oscillator from '../../Oscillator';
import { BaseSoundGenerator } from '../BaseSoundGenerator';

export class RhythmSoundGenerator extends BaseSoundGenerator {
  generate(
    data: number[],
    config: Required<SonifierConfig>,
    oscillator: Oscillator,
  ): SoundGenerationResult {
    const bufferLength = config.sampleRate * config.duration;
    const audioData = new Float32Array(bufferLength);
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
        timestamp: index * (config.duration / data.length),
        volume: this.mapValueToVolume(config, normalizedValue),
        frequency: this.mapValueToFrequency(config, normalizedValue),
      };
    });

    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      const normalizedValue = this.normalizeValue(value, data, cache);
      const interval = this.mapValueToInterval(config, normalizedValue);
      const timestamp = i * (config.duration / data.length);

      const startSample = Math.floor(timestamp * config.sampleRate);

      const soundDuration = Math.min(0.1, interval * 0.1);
      const soundEndSample = Math.floor((timestamp + soundDuration) * config.sampleRate);

      for (
        let sample = startSample;
        sample < soundEndSample && sample < audioData.length;
        sample++
      ) {
        const time = sample / config.sampleRate;
        const localTime = time - timestamp;
        audioData[sample] = oscillator.oscillate(baseFrequency, localTime) * config.volume;
      }

      if (i < data.length - 1) {
        const nextTimestamp = (i + 1) * (config.duration / data.length);
        const silenceStartSample = soundEndSample;
        const silenceEndSample = Math.floor(nextTimestamp * config.sampleRate);

        for (
          let sample = silenceStartSample;
          sample < silenceEndSample && sample < audioData.length;
          sample++
        ) {
          audioData[sample] = 0;
        }
      }
    }

    return { audioData, dataPoints };
  }
}
