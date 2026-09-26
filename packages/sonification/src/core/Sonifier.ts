import type {
  SonifierConfig,
  DataPoint,
  SonifierResult,
  SonifierMethod,
  SonifierOptions,
} from '../typings/sonifier';
import defaultConfig from '../constants/defaultConfig';
import createAudioWorker from './createAudioWorker';
import { SonificationError, ERROR_CODES } from './errors';
import Oscillator from './modules/Oscillator';
import SoundGenerator from './modules/SoundGenerator';

interface PendingWorkerRequest {
  reject: (error: SonificationError) => void;
  timeoutId: ReturnType<typeof setTimeout>;
  handleMessage: (event: MessageEvent) => void;
}

interface WorkerResponseMessage {
  type?: string;
  requestId?: number;
  payload?: {
    audioData?: Float32Array;
    dataPoints?: DataPoint[];
    sampleRate?: number;
    error?: {
      message?: string;
    };
  };
}

export default class Sonifier {
  private config: Required<SonifierConfig>;
  private audioContext: AudioContext | null = null;
  private oscillator: Oscillator;
  private worker: Worker | null = null;
  private isWorkerSupported: boolean;
  private currentSource: AudioBufferSourceNode | null = null;
  private playResolve: (() => void) | null = null;
  private playbackEpoch = 0;
  private nextWorkerRequestId = 0;
  private pendingWorkerRequests = new Map<number, PendingWorkerRequest>();

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
    const playbackEpoch = this.playbackEpoch;

    try {
      const { audioBuffer, dataPoints } = await this.generateAudio(data, method);

      if (options?.autoPlay && playbackEpoch === this.playbackEpoch) {
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
      this.stopCurrentSource();

      const audioContext = this.getAudioContext();

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      this.currentSource = source;
      source.start();

      return new Promise((resolve) => {
        this.playResolve = resolve;
        source.onended = () => {
          if (this.currentSource === source) {
            this.currentSource = null;
          }
          const playResolve = this.playResolve;
          this.playResolve = null;
          playResolve?.();
        };
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

  /**
   * Stops the currently playing audio, if any.
   * Resolves any pending `play()` promise.
   * Does not cancel in-flight audio generation, but skips `autoPlay` for a `sonify()` that is still generating.
   */
  stop(): void {
    this.playbackEpoch += 1;
    this.stopCurrentSource();
  }

  private stopCurrentSource(): void {
    const source = this.currentSource;
    if (!source) {
      return;
    }

    this.currentSource = null;
    source.onended = null;

    try {
      source.stop();
    } catch {
      // Already stopped or never started
    }

    const playResolve = this.playResolve;
    this.playResolve = null;
    playResolve?.();
  }

  getConfig(): Required<SonifierConfig> {
    return { ...this.config };
  }

  setConfig(config: SonifierConfig): void {
    const mergedConfig = {
      ...this.config,
      ...config,
    };

    this.validateConfig(mergedConfig);
    this.config = mergedConfig;
    this.oscillator = new Oscillator(this.config.waveType);
  }

  cleanup(): void {
    this.stop();
    this.rejectPendingWorkerRequests(
      new SonificationError('Sonifier was cleaned up', ERROR_CODES.CANCELLED),
    );

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

      const frames = Math.max(1, audioData.length);
      const buffer = audioContext.createBuffer(1, frames, sampleRate);

      if (audioData.length > 0) {
        buffer.getChannelData(0).set(audioData);
      } else {
        // eslint-disable-next-line no-console
        console.warn('Audio data is empty, creating buffer with 1 frame');
      }

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
      this.worker = createAudioWorker();
    } catch (error) {
      throw new SonificationError('Failed to initialize Web Worker', ERROR_CODES.WORKER_ERROR, {
        cause: error instanceof Error ? error : undefined,
      });
    }
  }

  private rejectPendingWorkerRequests(error: SonificationError): void {
    for (const requestId of [...this.pendingWorkerRequests.keys()]) {
      const pending = this.pendingWorkerRequests.get(requestId);
      if (!pending) continue;

      this.settleWorkerRequest(requestId);
      pending.reject(error);
    }
  }

  private settleWorkerRequest(requestId: number): PendingWorkerRequest | undefined {
    const pending = this.pendingWorkerRequests.get(requestId);
    if (!pending) return undefined;

    clearTimeout(pending.timeoutId);
    this.worker?.removeEventListener('message', pending.handleMessage);
    this.pendingWorkerRequests.delete(requestId);
    return pending;
  }

  private isTerminalWorkerError(error: unknown): boolean {
    return (
      error instanceof SonificationError &&
      (error.code === ERROR_CODES.TIMEOUT_ERROR || error.code === ERROR_CODES.CANCELLED)
    );
  }

  private generateAudioWithWorker(
    data: number[],
    method: SonifierMethod,
  ): Promise<{ audioBuffer: AudioBuffer; dataPoints: DataPoint[] }> {
    if (!this.worker) {
      throw new SonificationError('Web Worker initialization failed', ERROR_CODES.WORKER_ERROR);
    }

    const requestId = ++this.nextWorkerRequestId;
    const worker = this.worker;

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (!this.pendingWorkerRequests.has(requestId)) return;

        this.settleWorkerRequest(requestId);
        reject(
          new SonificationError('Sonification timeout after 10 seconds', ERROR_CODES.TIMEOUT_ERROR),
        );
      }, 1000 * 10);

      const handleMessage = (event: MessageEvent<WorkerResponseMessage>) => {
        const message = event.data;
        if (!message || message.requestId !== requestId) return;

        this.settleWorkerRequest(requestId);

        if (message.type === 'AUDIO_GENERATED') {
          try {
            const audioData = message.payload?.audioData;
            const dataPoints = message.payload?.dataPoints;
            const sampleRate = message.payload?.sampleRate;

            if (!audioData || !dataPoints || sampleRate === undefined) {
              reject(
                new SonificationError(
                  'Worker response is missing audio data',
                  ERROR_CODES.WORKER_ERROR,
                ),
              );
              return;
            }

            const buffer = this.createAudioBuffer(audioData, sampleRate);
            resolve({ audioBuffer: buffer, dataPoints });
          } catch (error) {
            reject(error);
          }
          return;
        }

        if (message.type === 'ERROR') {
          const workerErrorMessage = message.payload?.error?.message;
          reject(
            new SonificationError(
              workerErrorMessage || 'Worker error occurred',
              ERROR_CODES.WORKER_ERROR,
              {
                cause: new Error(workerErrorMessage || 'Unknown worker error'),
              },
            ),
          );
        }
      };

      this.pendingWorkerRequests.set(requestId, { reject, timeoutId, handleMessage });
      worker.addEventListener('message', handleMessage);

      try {
        worker.postMessage({
          type: 'GENERATE_AUDIO',
          requestId,
          payload: {
            data,
            method,
            config: this.config,
          },
        });
      } catch (error) {
        this.settleWorkerRequest(requestId);
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
        // 타임아웃과 정리는 메인 스레드로 다시 시도하지 않는다.
        if (this.isTerminalWorkerError(error)) {
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

  private validateData(data: number[]): boolean {
    if (!Array.isArray(data)) {
      throw new SonificationError('Data must be an array', ERROR_CODES.VALIDATION_ERROR, {
        field: 'data',
      });
    }

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

    return true;
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
