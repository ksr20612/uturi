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
import SoundGenerator from './modules/SoundGenerator';

export default class Sonifier {
  private config: Required<SonifierConfig>;
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
          throw error;
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
    const generator = new SoundGenerator(method);
    const { audioData, dataPoints } = generator.generate(data, this.config, this.oscillator);
    const buffer = this.createAudioBuffer(audioData, this.config.sampleRate);

    return { audioBuffer: buffer, dataPoints };
  }

  private validateData(data: number[]): void {
    if (!Array.isArray(data)) {
      throw new SonificationError('Data must be an array', ERROR_CODES.VALIDATION_ERROR, {
        field: 'data',
      });
    }

    // 빈 배열 허용
    if (data.length === 0) return;

    // TODO: 스트리밍 기능 추가되면 제한 전략 수정 필요
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
