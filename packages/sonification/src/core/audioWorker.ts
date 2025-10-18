import type { SonifierConfig, SonifierMethod, DataPoint } from '../typings/sonification';

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

let workerConfig: Required<SonifierConfig> | null = null;
let lastProcessedData: number[] | null = null;

// getter
function getWorkerConfig(): Required<SonifierConfig> {
  if (!workerConfig) {
    throw new Error(
      'Worker configuration not initialized. Please ensure the worker is properly set up.',
    );
  }
  return workerConfig;
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

// 데이터 정규화
function normalizeValue(value: number): number {
  if (!lastProcessedData || lastProcessedData.length === 0) {
    return Math.max(0, Math.min(1, value));
  }

  const dataMin = Math.min(...lastProcessedData);
  const dataMax = Math.max(...lastProcessedData);
  const dataRange = dataMax - dataMin;

  return dataRange > 0 ? Math.max(0, Math.min(1, (value - dataMin) / dataRange)) : 0.5;
}

// 데이터 매핑
function mapValueToFrequency(value: number): number {
  const config = getWorkerConfig();
  const normalizedValue = normalizeValue(value);
  return config.minFrequency + normalizedValue * (config.maxFrequency - config.minFrequency);
}

function mapValueToVolume(value: number): number {
  const config = getWorkerConfig();
  const normalizedValue = normalizeValue(value);
  return config.minVolume + normalizedValue * (config.maxVolume - config.minVolume);
}

function mapValueToInterval(value: number): number {
  const config = getWorkerConfig();
  const normalizedValue = normalizeValue(value);
  return config.minRhythm + (1 - normalizedValue) * (config.maxRhythm - config.minRhythm);
}

function mapValueToNote(value: number): number {
  const normalizedValue = normalizeValue(value);
  const notes = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88];
  const noteIndex = Math.min(Math.floor(normalizedValue * 7), 6);
  return notes[noteIndex];
}

function mapValueToNoteName(value: number): string {
  const normalizedValue = normalizeValue(value);
  const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const noteIndex = Math.min(Math.floor(normalizedValue * 7), 6);
  return noteNames[noteIndex];
}

// 오디오 생성
function generateVolumeAudio(data: number[]): { audioData: Float32Array; dataPoints: DataPoint[] } {
  const config = getWorkerConfig();
  const bufferLength = config.sampleRate * config.duration;
  const audioData = new Float32Array(bufferLength);
  const timeStep = config.duration / data.length;
  const baseFrequency = config.frequency;

  const dataPoints: DataPoint[] = data.map((value, index) => ({
    value,
    timestamp: index * timeStep,
    volume: mapValueToVolume(value),
    frequency: mapValueToFrequency(value),
  }));

  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    const startSample = Math.floor(i * timeStep * config.sampleRate);
    const endSample = Math.floor((i + 1) * timeStep * config.sampleRate);
    const volume = mapValueToVolume(value);

    for (let sample = startSample; sample < endSample && sample < audioData.length; sample++) {
      const timePosition = sample / config.sampleRate;
      const localTime = timePosition - i * timeStep;
      audioData[sample] = Math.sin(2 * Math.PI * baseFrequency * localTime) * volume;
    }
  }

  return { audioData, dataPoints };
}

function generateRhythmAudio(data: number[]): { audioData: Float32Array; dataPoints: DataPoint[] } {
  const config = getWorkerConfig();
  const bufferLength = config.sampleRate * config.duration;
  const audioData = new Float32Array(bufferLength);
  const baseFrequency = config.frequency;

  const dataPoints: DataPoint[] = data.map((value, index) => ({
    value,
    timestamp: index * (config.duration / data.length),
    volume: mapValueToVolume(value),
    frequency: mapValueToFrequency(value),
  }));

  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    const interval = mapValueToInterval(value);
    const timestamp = i * (config.duration / data.length);
    const startSample = Math.floor(timestamp * config.sampleRate);
    const soundDuration = Math.min(0.1, interval * 0.1);
    const soundEndSample = Math.floor((timestamp + soundDuration) * config.sampleRate);

    for (let sample = startSample; sample < soundEndSample && sample < audioData.length; sample++) {
      const time = sample / config.sampleRate;
      const localTime = time - timestamp;
      audioData[sample] = Math.sin(2 * Math.PI * baseFrequency * localTime) * config.volume;
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

function generateMelodyAudio(data: number[]): { audioData: Float32Array; dataPoints: DataPoint[] } {
  const config = getWorkerConfig();
  const bufferLength = config.sampleRate * config.duration;
  const audioData = new Float32Array(bufferLength);
  const timeStep = config.duration / data.length;

  const dataPoints: DataPoint[] = data.map((value, index) => ({
    value,
    timestamp: index * timeStep,
    volume: mapValueToVolume(value),
    frequency: mapValueToFrequency(value),
    note: mapValueToNoteName(value),
  }));

  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    const startSample = Math.floor(i * timeStep * config.sampleRate);
    const endSample = Math.floor((i + 1) * timeStep * config.sampleRate);
    const frequency = mapValueToNote(value);

    for (let sample = startSample; sample < endSample && sample < audioData.length; sample++) {
      const time = sample / config.sampleRate;
      const localTime = time - i * timeStep;
      audioData[sample] = Math.sin(2 * Math.PI * frequency * localTime) * config.volume;
    }
  }

  return { audioData, dataPoints };
}

function generateFrequencyAudio(data: number[]): {
  audioData: Float32Array;
  dataPoints: DataPoint[];
} {
  const config = getWorkerConfig();
  const bufferLength = config.sampleRate * config.duration;
  const audioData = new Float32Array(bufferLength);
  const timeStep = config.duration / data.length;

  const dataPoints: DataPoint[] = data.map((value, index) => ({
    value,
    timestamp: index * timeStep,
    volume: mapValueToVolume(value),
    frequency: mapValueToFrequency(value),
  }));

  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    const startSample = Math.floor(i * timeStep * config.sampleRate);
    const endSample = Math.floor((i + 1) * timeStep * config.sampleRate);
    const frequency = mapValueToFrequency(value);

    for (let sample = startSample; sample < endSample && sample < audioData.length; sample++) {
      const time = sample / config.sampleRate;
      const localTime = time - i * timeStep;
      audioData[sample] = Math.sin(2 * Math.PI * frequency * localTime) * config.volume;
    }
  }

  return { audioData, dataPoints };
}

// 메시지 수신 처리
self.onmessage = (event: MessageEvent<AudioWorkerMessage>) => {
  const { type, payload } = event.data;

  if (type === 'GENERATE_AUDIO') {
    const { data, method, config } = payload;

    validateConfig(config);

    workerConfig = config;
    lastProcessedData = data;

    let result: { audioData: Float32Array; dataPoints: DataPoint[] };

    switch (method) {
      case 'volume':
        result = generateVolumeAudio(data);
        break;
      case 'rhythm':
        result = generateRhythmAudio(data);
        break;
      case 'melody':
        result = generateMelodyAudio(data);
        break;
      case 'frequency':
        result = generateFrequencyAudio(data);
        break;
      default:
        result = generateMelodyAudio(data);
    }

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
  }
};
