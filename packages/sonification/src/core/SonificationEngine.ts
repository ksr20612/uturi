import type {
  SonificationConfig,
  DataPoint,
  SonificationResult,
  SonificationMethod,
  SonificationOptions,
} from '../typings/sonification';
import defaultConfig from '../constants/defaultConfig';

export default class SonificationEngine {
  private config: Required<SonificationConfig>;
  private lastProcessedData: number[] | null = null;

  constructor(config: SonificationConfig = {}) {
    this.config = {
      ...defaultConfig,
      ...config,
    };
  }

  async sonify<T extends SonificationMethod>(
    data: number[],
    method: T,
    options?: SonificationOptions,
  ): Promise<SonificationResult> {
    this.lastProcessedData = data;

    const { audioBuffer, dataPoints } = await this.generateAudio(data, method);

    if (options?.autoPlay) {
      await this.play(audioBuffer);
    }

    return {
      audioBuffer,
      duration: this.config.duration,
      dataPoints,
    };
  }

  getConfig(): Required<SonificationConfig> {
    return { ...this.config };
  }

  // TODO: 최적화 필요
  async play(audioBuffer: AudioBuffer): Promise<void> {
    const audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();

    return new Promise((resolve) => {
      source.onended = () => resolve();
    });
  }

  private async generateAudio(
    data: number[],
    method: SonificationMethod = 'melody',
  ): Promise<{ audioBuffer: AudioBuffer; dataPoints: DataPoint[] }> {
    switch (method) {
      case 'melody':
        return this.generateMelodyAudio(data);
      case 'frequency':
        return this.generateFrequencyAudio(data);
      case 'volume':
        return this.generateVolumeAudio(data);
      case 'rhythm':
        return this.generateRhythmAudio(data);
      default:
        return this.generateMelodyAudio(data);
    }
  }

  // Sonificate by volume
  private async generateVolumeAudio(
    data: number[],
  ): Promise<{ audioBuffer: AudioBuffer; dataPoints: DataPoint[] }> {
    const bufferLength = this.config.sampleRate * this.config.duration;
    const audioData = new Float32Array(bufferLength);
    const timeStep = this.config.duration / data.length;
    const baseFrequency = this.config.frequency;

    const dataPoints: DataPoint[] = data.map((value, index) => ({
      value,
      timestamp: index * timeStep,
      volume: this.mapValueToVolume(value),
      frequency: this.mapValueToFrequency(value),
    }));

    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      const startSample = Math.floor(i * timeStep * this.config.sampleRate);
      const endSample = Math.floor((i + 1) * timeStep * this.config.sampleRate);

      const volume = this.mapValueToVolume(value);

      for (let sample = startSample; sample < endSample && sample < audioData.length; sample++) {
        const timePosition = sample / this.config.sampleRate;
        const localTime = timePosition - i * timeStep;
        audioData[sample] = Math.sin(2 * Math.PI * baseFrequency * localTime) * volume;
      }
    }

    const audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const buffer = audioContext.createBuffer(1, bufferLength, this.config.sampleRate);
    buffer.copyToChannel(audioData, 0);

    return { audioBuffer: buffer, dataPoints };
  }

  // Sonificate by rhythm
  private async generateRhythmAudio(
    data: number[],
  ): Promise<{ audioBuffer: AudioBuffer; dataPoints: DataPoint[] }> {
    const bufferLength = this.config.sampleRate * this.config.duration;
    const audioData = new Float32Array(bufferLength);
    const baseFrequency = this.config.frequency;

    const dataPoints: DataPoint[] = data.map((value, index) => ({
      value,
      timestamp: index * (this.config.duration / data.length),
      volume: this.mapValueToVolume(value),
      frequency: this.mapValueToFrequency(value),
    }));

    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      const interval = this.mapValueToInterval(value);
      const timestamp = i * (this.config.duration / data.length);

      const startSample = Math.floor(timestamp * this.config.sampleRate);

      const soundDuration = Math.min(0.1, interval * 0.1);
      const soundEndSample = Math.floor((timestamp + soundDuration) * this.config.sampleRate);

      for (
        let sample = startSample;
        sample < soundEndSample && sample < audioData.length;
        sample++
      ) {
        const time = sample / this.config.sampleRate;
        const localTime = time - timestamp;
        audioData[sample] = Math.sin(2 * Math.PI * baseFrequency * localTime) * this.config.volume;
      }

      if (i < data.length - 1) {
        const nextTimestamp = (i + 1) * (this.config.duration / data.length);
        const silenceStartSample = soundEndSample;
        const silenceEndSample = Math.floor(nextTimestamp * this.config.sampleRate);

        for (
          let sample = silenceStartSample;
          sample < silenceEndSample && sample < audioData.length;
          sample++
        ) {
          audioData[sample] = 0;
        }
      }
    }

    const audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const buffer = audioContext.createBuffer(1, bufferLength, this.config.sampleRate);
    buffer.copyToChannel(audioData, 0);

    return { audioBuffer: buffer, dataPoints };
  }

  // Sonification by melody
  private async generateMelodyAudio(
    data: number[],
  ): Promise<{ audioBuffer: AudioBuffer; dataPoints: DataPoint[] }> {
    const bufferLength = this.config.sampleRate * this.config.duration;
    const audioData = new Float32Array(bufferLength);
    const timeStep = this.config.duration / data.length;

    const dataPoints: DataPoint[] = data.map((value, index) => ({
      value,
      timestamp: index * timeStep,
      volume: this.mapValueToVolume(value),
      frequency: this.mapValueToFrequency(value),
      note: this.mapValueToNoteName(value),
    }));

    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      const startSample = Math.floor(i * timeStep * this.config.sampleRate);
      const endSample = Math.floor((i + 1) * timeStep * this.config.sampleRate);

      const frequency = this.mapValueToNote(value);

      for (let sample = startSample; sample < endSample && sample < audioData.length; sample++) {
        const time = sample / this.config.sampleRate;
        const localTime = time - i * timeStep;
        audioData[sample] = Math.sin(2 * Math.PI * frequency * localTime) * this.config.volume;
      }
    }

    const audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const buffer = audioContext.createBuffer(1, bufferLength, this.config.sampleRate);
    buffer.copyToChannel(audioData, 0);

    return { audioBuffer: buffer, dataPoints };
  }

  // Sonification by frequency
  private async generateFrequencyAudio(
    data: number[],
  ): Promise<{ audioBuffer: AudioBuffer; dataPoints: DataPoint[] }> {
    const bufferLength = this.config.sampleRate * this.config.duration;
    const audioData = new Float32Array(bufferLength);
    const timeStep = this.config.duration / data.length;

    // DataPoint[] 생성
    const dataPoints: DataPoint[] = data.map((value, index) => ({
      value,
      timestamp: index * timeStep,
      volume: this.mapValueToVolume(value),
      frequency: this.mapValueToFrequency(value),
    }));

    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      const startSample = Math.floor(i * timeStep * this.config.sampleRate);
      const endSample = Math.floor((i + 1) * timeStep * this.config.sampleRate);

      const frequency = this.mapValueToFrequency(value);

      for (let sample = startSample; sample < endSample && sample < audioData.length; sample++) {
        const time = sample / this.config.sampleRate;
        const localTime = time - i * timeStep;
        audioData[sample] = Math.sin(2 * Math.PI * frequency * localTime) * this.config.volume;
      }
    }

    const audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const buffer = audioContext.createBuffer(1, bufferLength, this.config.sampleRate);
    buffer.copyToChannel(audioData, 0);

    return { audioBuffer: buffer, dataPoints };
  }

  private normalizeValue(value: number): number {
    // lastProcessedData가 없거나 비어있는 경우, 입력값을 0-1 범위로 정규화
    if (!this.lastProcessedData || this.lastProcessedData.length === 0) {
      return Math.max(0, Math.min(1, value));
    }

    const dataMin = Math.min(...this.lastProcessedData);
    const dataMax = Math.max(...this.lastProcessedData);
    const dataRange = dataMax - dataMin;

    return dataRange > 0 ? Math.max(0, Math.min(1, (value - dataMin) / dataRange)) : 0.5;
  }

  private mapValueToFrequency(value: number): number {
    const normalizedValue = this.normalizeValue(value);
    const minFrequency = this.config.minFrequency;
    const maxFrequency = this.config.maxFrequency;

    return minFrequency + normalizedValue * (maxFrequency - minFrequency);
  }

  private mapValueToVolume(value: number): number {
    const normalizedValue = this.normalizeValue(value);
    const minVolume = this.config.minVolume;
    const maxVolume = this.config.maxVolume;

    return minVolume + normalizedValue * (maxVolume - minVolume);
  }

  private mapValueToInterval(value: number): number {
    const normalizedValue = this.normalizeValue(value);
    const minRhythm = this.config.minRhythm;
    const maxRhythm = this.config.maxRhythm;

    return minRhythm + (1 - normalizedValue) * (maxRhythm - minRhythm);
  }

  private mapValueToNote(value: number): number {
    const normalizedValue = this.normalizeValue(value);
    const notes = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88];
    const noteIndex = Math.min(Math.floor(normalizedValue * 7), 6);

    return notes[noteIndex];
  }

  private mapValueToNoteName(value: number): string {
    const normalizedValue = this.normalizeValue(value);
    const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const noteIndex = Math.min(Math.floor(normalizedValue * 7), 6);

    return noteNames[noteIndex];
  }
}
