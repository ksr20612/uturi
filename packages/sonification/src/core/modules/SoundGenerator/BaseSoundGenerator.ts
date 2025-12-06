import type { SoundGenerationResult, SoundGeneratorStrategy } from '.';
import type { SonifierConfig } from '../../../typings/sonification';
import type Oscillator from '../Oscillator';

export abstract class BaseSoundGenerator implements SoundGeneratorStrategy {
  abstract generate(
    data: number[],
    config: Required<SonifierConfig>,
    oscillator: Oscillator,
  ): SoundGenerationResult;

  protected normalizeValue(
    value: number,
    data: number[],
    cache?: { min: number; max: number; range: number },
  ): number {
    // 캐시된 값이 있으면 사용 (성능 최적화)
    let min, max, range;

    if (cache) {
      ({ min, max, range } = cache);
    } else {
      if (data.length === 0) return Math.max(0, Math.min(1, value));
      min = Math.min(...data);
      max = Math.max(...data);
      range = max - min;
    }

    return range > 0 ? Math.max(0, Math.min(1, (value - min) / range)) : 0.5;
  }

  protected mapValueToFrequency(config: Required<SonifierConfig>, normalizedValue: number): number {
    return config.minFrequency + normalizedValue * (config.maxFrequency - config.minFrequency);
  }

  protected mapValueToVolume(config: Required<SonifierConfig>, normalizedValue: number): number {
    return config.minVolume + normalizedValue * (config.maxVolume - config.minVolume);
  }

  protected mapValueToInterval(config: Required<SonifierConfig>, normalizedValue: number): number {
    return config.minRhythm + (1 - normalizedValue) * (config.maxRhythm - config.minRhythm);
  }

  protected mapValueToNote(normalizedValue: number): number {
    const notes = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88];
    const noteIndex = Math.min(Math.floor(normalizedValue * 7), 6);
    return notes[noteIndex];
  }

  protected mapValueToNoteName(normalizedValue: number): string {
    const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const noteIndex = Math.min(Math.floor(normalizedValue * 7), 6);
    return noteNames[noteIndex];
  }
}
