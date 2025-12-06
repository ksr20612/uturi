import type {
  SonifierConfig,
  DataPoint,
  SonifierResult,
  SonifierMethod,
  SonifierOptions,
} from '../typings/sonification';
import defaultConfig from '../constants/defaultConfig';
import AudioWorker from './audioWorker?worker&inline';
import { SonificationError, ERROR_CODES } from './errors';
import Oscillator from './modules/Oscillator';

export default class Sonifier {
  private config: Required<SonifierConfig>;
  private lastProcessedData: number[] | null = null;
  private audioContext: AudioContext | null = null;
  private oscillator: Oscillator;
  private worker: Worker | null = null;
  private isWorkerSupported: boolean;

  constructor(config: SonifierConfig = {}) {
    const mergedConfig = {
      ...defaultConfig,
      ...config,
    };

    this.validateConfig(mergedConfig);
    this.config = mergedConfig;
    this.isWorkerSupported = typeof Worker !== 'undefined';

    this.oscillator = new Oscillator(this.config.waveType);

    if (this.isWorkerSupported) {
      this.initializeWorker();
    }
  }

  async sonify<T extends SonifierMethod>(
    data: number[],
    method: T,
    options?: SonifierOptions,
  ): Promise<SonifierResult> {
    this.validateData(data);
    this.lastProcessedData = data;

    try {
      const { audioBuffer, dataPoints } = await this.generateAudio(data, method);

      if (options?.autoPlay) {
        await this.play(audioBuffer);
      }

      return {
        audioBuffer,
        duration: this.config.duration,
        dataPoints,
      };
    } catch (error) {
      if (error instanceof SonificationError) {
        throw error;
      }

      throw new SonificationError(
        error instanceof Error ? error.message : String(error),
        ERROR_CODES.UNKNOWN_ERROR,
        { cause: error instanceof Error ? error : undefined },
      );
    }
  }

  async play(audioBuffer: AudioBuffer): Promise<void> {
    try {
      const audioContext = this.getAudioContext();

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
    } catch (error) {
      if (error instanceof SonificationError) {
        throw error;
      }

      throw new SonificationError(
        error instanceof Error ? error.message : 'Audio playback failed',
        ERROR_CODES.AUDIO_CONTEXT_ERROR,
        { cause: error instanceof Error ? error : undefined },
      );
    }
  }

  getConfig(): Required<SonifierConfig> {
    return { ...this.config };
  }

  setConfig(config: SonifierConfig): void {
    const mergedConfig = {
      ...defaultConfig,
      ...config,
    };

    this.validateConfig(mergedConfig);
    this.config = mergedConfig;
  }

  cleanup(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch (error) {
        throw new SonificationError(
          'Failed to create AudioContext',
          ERROR_CODES.AUDIO_CONTEXT_ERROR,
          { cause: error instanceof Error ? error : undefined },
        );
      }
    }
    return this.audioContext;
  }

  /**
   * AudioBuffer를 생성하는 헬퍼 메서드
   * AudioContext 관련 에러를 일관되게 처리합니다.
   */
  private createAudioBuffer(audioData: Float32Array, sampleRate: number): AudioBuffer {
    try {
      const audioContext = this.getAudioContext();
      const buffer = audioContext.createBuffer(1, audioData.length, sampleRate);
      buffer.getChannelData(0).set(audioData);
      return buffer;
    } catch (error) {
      if (error instanceof SonificationError) {
        throw error;
      }

      throw new SonificationError(
        'Failed to create audio buffer',
        ERROR_CODES.AUDIO_CONTEXT_ERROR,
        { cause: error instanceof Error ? error : undefined },
      );
    }
  }

  private initializeWorker(): void {
    if (this.worker || !this.isWorkerSupported) return;

    try {
      this.worker = new AudioWorker();
    } catch (error) {
      throw new SonificationError('Failed to initialize Web Worker', ERROR_CODES.WORKER_ERROR, {
        cause: error instanceof Error ? error : undefined,
      });
    }
  }

  private generateAudioWithWorker(
    data: number[],
    method: SonifierMethod,
  ): Promise<{ audioBuffer: AudioBuffer; dataPoints: DataPoint[] }> {
    if (!this.worker) {
      throw new SonificationError('Web Worker initialization failed', ERROR_CODES.WORKER_ERROR);
    }

    return new Promise((resolve, reject) => {
      // timeout
      const timeout = setTimeout(() => {
        this.worker?.removeEventListener('message', handleMessage);
        reject(
          new SonificationError('Sonification timeout after 10 seconds', ERROR_CODES.TIMEOUT_ERROR),
        );
      }, 1000 * 10);

      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'AUDIO_GENERATED') {
          clearTimeout(timeout);
          this.worker!.removeEventListener('message', handleMessage);

          try {
            const { audioData, dataPoints, sampleRate } = event.data.payload;

            const buffer = this.createAudioBuffer(audioData, sampleRate);
            resolve({ audioBuffer: buffer, dataPoints });
          } catch (error) {
            reject(error);
          }
        } else if (event.data.type === 'ERROR') {
          clearTimeout(timeout);
          this.worker!.removeEventListener('message', handleMessage);

          const { error: workerError } = event.data.payload;
          reject(
            new SonificationError(
              workerError.message || 'Worker error occurred',
              ERROR_CODES.WORKER_ERROR,
              {
                cause: new Error(workerError.message || 'Unknown worker error'),
              },
            ),
          );
        }
      };

      if (!this.worker) {
        clearTimeout(timeout);
        reject(new SonificationError('Web Worker is not available', ERROR_CODES.WORKER_ERROR));
        return;
      }

      this.worker.addEventListener('message', handleMessage);

      try {
        this.worker.postMessage({
          type: 'GENERATE_AUDIO',
          payload: {
            data,
            method,
            config: this.config,
          },
        });
      } catch (error) {
        clearTimeout(timeout);
        if (this.worker) {
          this.worker.removeEventListener('message', handleMessage);
        }
        reject(
          new SonificationError('Failed to send message to worker', ERROR_CODES.WORKER_ERROR, {
            cause: error instanceof Error ? error : undefined,
          }),
        );
      }
    });
  }

  private async generateAudio(
    data: number[],
    method: SonifierMethod = 'melody',
  ): Promise<{ audioBuffer: AudioBuffer; dataPoints: DataPoint[] }> {
    if (this.isWorkerSupported && this.worker) {
      try {
        return await this.generateAudioWithWorker(data, method);
      } catch (error) {
        // Worker 에러는 메인 스레드로 폴백 (타임아웃 제외)
        if (error instanceof SonificationError && error.code === ERROR_CODES.TIMEOUT_ERROR) {
          throw error; // 타임아웃은 재시도하지 않음
        }

        // eslint-disable-next-line no-console
        console.warn('Generate Audio with Worker failed, generate on main thread:', error);
        return this.generateAudioOnMainThread(data, method);
      }
    } else {
      return this.generateAudioOnMainThread(data, method);
    }
  }

  private async generateAudioOnMainThread(
    data: number[],
    method: SonifierMethod = 'melody',
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

  // Sonify by volume
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
        audioData[sample] = this.oscillator.oscillate(baseFrequency, localTime) * volume;
      }
    }

    const buffer = this.createAudioBuffer(audioData, this.config.sampleRate);

    return { audioBuffer: buffer, dataPoints };
  }

  // Sonify by rhythm
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
        audioData[sample] =
          this.oscillator.oscillate(baseFrequency, localTime) * this.config.volume;
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

    const buffer = this.createAudioBuffer(audioData, this.config.sampleRate);

    return { audioBuffer: buffer, dataPoints };
  }

  // Sonify by melody
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
        audioData[sample] = this.oscillator.oscillate(frequency, localTime) * this.config.volume;
      }
    }

    const buffer = this.createAudioBuffer(audioData, this.config.sampleRate);

    return { audioBuffer: buffer, dataPoints };
  }

  // Sonify by frequency
  private async generateFrequencyAudio(
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
    }));

    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      const startSample = Math.floor(i * timeStep * this.config.sampleRate);
      const endSample = Math.floor((i + 1) * timeStep * this.config.sampleRate);

      const frequency = this.mapValueToFrequency(value);

      for (let sample = startSample; sample < endSample && sample < audioData.length; sample++) {
        const time = sample / this.config.sampleRate;
        const localTime = time - i * timeStep;
        audioData[sample] = this.oscillator.oscillate(frequency, localTime) * this.config.volume;
      }
    }

    const buffer = this.createAudioBuffer(audioData, this.config.sampleRate);

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

  /**
   * 입력 데이터 검증
   */
  private validateData(data: number[]): void {
    if (!Array.isArray(data)) {
      throw new SonificationError('Data must be an array', ERROR_CODES.VALIDATION_ERROR, {
        field: 'data',
      });
    }

    if (data.length === 0) {
      return; // 빈 배열은 허용
    }

    if (data.length > 10000) {
      throw new SonificationError(
        'Data array too large (max 10000 items)',
        ERROR_CODES.VALIDATION_ERROR,
        { field: 'data.length' },
      );
    }

    const invalidValues = data.filter(
      (val) => !Number.isFinite(val) || val === null || val === undefined,
    );

    if (invalidValues.length > 0) {
      throw new SonificationError(
        'Data contains invalid values (NaN, Infinity, null, or undefined)',
        ERROR_CODES.VALIDATION_ERROR,
        { field: 'data' },
      );
    }
  }

  /**
   * 설정값 검증
   */
  private validateConfig(config: Required<SonifierConfig>): void {
    if (config.sampleRate <= 0) {
      throw new SonificationError('Sample rate must be positive', ERROR_CODES.VALIDATION_ERROR, {
        field: 'sampleRate',
      });
    }

    if (config.duration <= 0) {
      throw new SonificationError('Duration must be positive', ERROR_CODES.VALIDATION_ERROR, {
        field: 'duration',
      });
    }

    if (config.minFrequency >= config.maxFrequency) {
      throw new SonificationError(
        'Minimum frequency must be less than maximum frequency',
        ERROR_CODES.VALIDATION_ERROR,
        { field: 'frequency' },
      );
    }

    if (config.minVolume >= config.maxVolume) {
      throw new SonificationError(
        'Minimum volume must be less than maximum volume',
        ERROR_CODES.VALIDATION_ERROR,
        { field: 'volume' },
      );
    }

    if (config.minRhythm >= config.maxRhythm) {
      throw new SonificationError(
        'Minimum rhythm must be less than maximum rhythm',
        ERROR_CODES.VALIDATION_ERROR,
        { field: 'rhythm' },
      );
    }

    if (config.volume < 0 || config.volume > 1) {
      throw new SonificationError('Volume must be between 0 and 1', ERROR_CODES.VALIDATION_ERROR, {
        field: 'volume',
      });
    }

    if (config.rhythm < 0 || config.rhythm > 1) {
      throw new SonificationError('Rhythm must be between 0 and 1', ERROR_CODES.VALIDATION_ERROR, {
        field: 'rhythm',
      });
    }
  }
}
