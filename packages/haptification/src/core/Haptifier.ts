/* eslint-disable no-console */
import type { HaptifierConfig, HapticSequence } from '../typings/haptifier';
import DEFAULT_CONFIG from '../constants/defaultConfig';
import { NumberAnalyzer, AudioAnalyzer, VibrationGenerator, WebVibrationDriver } from './modules';

export default class Haptifier {
  private readonly driver: NonNullable<HaptifierConfig['driver']>;
  private readonly numberAnalyzer: NumberAnalyzer;
  private readonly audioAnalyzer: AudioAnalyzer;
  private readonly vibrationGenerator: VibrationGenerator;
  private readonly config: HaptifierConfig;

  constructor(config: HaptifierConfig = {}) {
    this.config = config;
    this.driver = config.driver ?? new WebVibrationDriver();
    this.numberAnalyzer = new NumberAnalyzer();
    this.audioAnalyzer = new AudioAnalyzer();
    this.vibrationGenerator = new VibrationGenerator(config.method ?? DEFAULT_CONFIG.method);
  }

  haptify(data: number[]): HapticSequence {
    const normalized = this.numberAnalyzer.normalize(data);
    return this.vibrationGenerator.generate(normalized, this.config);
  }

  haptifyAudio(audio: AudioBuffer): HapticSequence {
    const features = this.audioAnalyzer.extractFeatures(audio);
    const normalized = this.numberAnalyzer.normalize(features);
    return this.vibrationGenerator.generate(normalized, this.config);
  }

  async play(data: number[]): Promise<void> {
    if (!this.driver.isSupported()) {
      console.warn('[haptification] Current driver does not support haptic feedback.');
      return;
    }
    await this.driver.play(this.haptify(data));
  }

  async playAudio(audio: AudioBuffer): Promise<void> {
    if (!this.driver.isSupported()) {
      console.warn('[haptification] Current driver does not support haptic feedback.');
      return;
    }
    await this.driver.play(this.haptifyAudio(audio));
  }

  async playSequence(sequence: HapticSequence): Promise<void> {
    if (!this.driver.isSupported()) {
      console.warn('[haptification] Current driver does not support haptic feedback.');
      return;
    }
    await this.driver.play(sequence);
  }

  stop(): void {
    this.driver.stop();
  }

  isSupported(): boolean {
    return this.driver.isSupported();
  }
}
