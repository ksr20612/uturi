/* eslint-disable no-console */
import type { HapticConfig, HapticEngine, HapticSequence } from './types';
import { NumberAnalyzer } from './analyzers/NumberAnalyzer';
import { AudioAnalyzer } from './analyzers/AudioAnalyzer';
import { PulseGenerator } from './generators/PulseGenerator';
import { RhythmGenerator } from './generators/RhythmGenerator';
import { WaveGenerator } from './generators/WaveGenerator';
import { WebDriver } from './drivers/WebDriver';

function resolveGenerator(config: HapticConfig) {
  switch (config.method ?? 'rhythm') {
    case 'pulse':
      return new PulseGenerator(config);
    case 'wave':
      return new WaveGenerator(config);
    case 'rhythm':
    default:
      return new RhythmGenerator(config);
  }
}

export function createHapticEngine(config: HapticConfig = {}): HapticEngine {
  const driver = config.driver ?? new WebDriver();
  const numberAnalyzer = new NumberAnalyzer();
  const audioAnalyzer = new AudioAnalyzer();
  const generator = resolveGenerator(config);

  return {
    toSequence(data: number[]): HapticSequence {
      const normalized = numberAnalyzer.normalize(data);
      return generator.generate(normalized);
    },

    async play(data: number[]): Promise<void> {
      if (!driver.isSupported()) {
        console.warn('[haptification] Current driver does not support haptic feedback.');
        return;
      }
      const sequence = this.toSequence(data);
      await driver.play(sequence);
    },

    async playAudio(audio: AudioBuffer): Promise<void> {
      if (!driver.isSupported()) {
        console.warn('[haptification] Current driver does not support haptic feedback.');
        return;
      }
      const features = audioAnalyzer.extractFeatures(audio);
      const normalized = numberAnalyzer.normalize(features);
      const sequence = generator.generate(normalized);
      await driver.play(sequence);
    },

    async playSequence(sequence: HapticSequence): Promise<void> {
      if (!driver.isSupported()) {
        console.warn('[haptification] Current driver does not support haptic feedback.');
        return;
      }
      await driver.play(sequence);
    },

    stop(): void {
      driver.stop();
    },

    isSupported(): boolean {
      return driver.isSupported();
    },
  };
}
