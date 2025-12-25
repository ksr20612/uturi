import type { SonifierConfig, SonifierMethod, DataPoint } from '../typings/sonifier';
import Oscillator from './modules/Oscillator';
import SoundGenerator from './modules/SoundGenerator';

interface AudioWorkerMessage {
  type: 'GENERATE_AUDIO';
  payload: {
    data: number[];
    method: SonifierMethod;
    config: Required<SonifierConfig>;
  };
}

interface AudioWorkerResponse {
  type: 'AUDIO_GENERATED';
  payload: {
    audioData: Float32Array;
    dataPoints: DataPoint[];
    sampleRate: number;
    duration: number;
  };
}

interface AudioWorkerErrorResponse {
  type: 'ERROR';
  payload: {
    error: {
      message: string;
      name: string;
      stack?: string;
    };
  };
}

// config 유효성 검증
function validateConfig(config: Required<SonifierConfig>): void {
  if (config.sampleRate <= 0) {
    throw new Error('Sample rate must be positive');
  }
  if (config.duration <= 0) {
    throw new Error('Duration must be positive');
  }
  if (config.minFrequency >= config.maxFrequency) {
    throw new Error('Minimum frequency must be less than maximum frequency');
  }
  if (config.minVolume >= config.maxVolume) {
    throw new Error('Minimum volume must be less than maximum volume');
  }
  if (config.minRhythm >= config.maxRhythm) {
    throw new Error('Minimum rhythm must be less than maximum rhythm');
  }
}

// 메시지 수신 처리
self.onmessage = (event: MessageEvent<AudioWorkerMessage>) => {
  const { type, payload } = event.data;

  if (type === 'GENERATE_AUDIO') {
    try {
      const { data, method, config } = payload;

      validateConfig(config);

      const oscillator = new Oscillator(config.waveType);
      const generator = new SoundGenerator(method);
      const result = generator.generate(data, config, oscillator);

      const response: AudioWorkerResponse = {
        type: 'AUDIO_GENERATED',
        payload: {
          audioData: result.audioData,
          dataPoints: result.dataPoints,
          sampleRate: config.sampleRate,
          duration: config.duration,
        },
      };

      self.postMessage(response, { transfer: [result.audioData.buffer] });
    } catch (error) {
      const errorResponse: AudioWorkerErrorResponse = {
        type: 'ERROR',
        payload: {
          error: {
            message: error instanceof Error ? error.message : String(error),
            name: error instanceof Error ? error.name : 'Error',
            stack: error instanceof Error ? error.stack : undefined,
          },
        },
      };

      self.postMessage(errorResponse);
    }
  }
};
