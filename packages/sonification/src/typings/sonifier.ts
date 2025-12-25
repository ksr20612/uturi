export interface SonifierConfig {
  // 기본 오디오 설정
  sampleRate?: number; // 샘플레이트 (기본값: 44100)
  duration?: number; // 오디오 길이 (기본값: 2.0초)
  waveType?: WaveType; // 파형 타입 (기본값: 'sine')

  // 주파수 설정
  frequency?: number; // 기본 주파수 (기본값: 825Hz)
  minFrequency?: number; // 최소 주파수 (기본값: 150Hz)
  maxFrequency?: number; // 최대 주파수 (기본값: 1500Hz)

  // 볼륨 설정
  volume?: number; // 기본 볼륨 (범위: 0 ~ 1, 기본값: 0.3)
  minVolume?: number; // 최소 볼륨 (기본값: 0.1)
  maxVolume?: number; // 최대 볼륨 (기본값: 0.5)

  // 리듬 설정
  rhythm?: number; // 기본 리듬 (범위: 0 ~ 1, 기본값: 0.5)
  minRhythm?: number; // 최소 리듬 (기본값: 0.1)
  maxRhythm?: number; // 최대 리듬 (기본값: 1)
}

export type WaveType = 'sine' | 'square' | 'sawtooth';

export interface SonifierOptions {
  autoPlay?: boolean; // 자동 재생 여부
}

export interface DataPoint {
  value: number;
  timestamp: number;
  volume: number;
  frequency: number;
  note?: string;
}

export interface SonifierResult {
  audioBuffer: AudioBuffer;
  duration: number;
  dataPoints: DataPoint[];
}

export interface ChartData {
  values: number[];
  labels?: string[];
  timestamps?: number[];
}

export type SonifierMethod =
  | 'frequency' // 값에 따라 주파수 변화
  | 'volume' // 값에 따라 볼륨 변화
  | 'rhythm' // 값에 따라 리듬 변화
  | 'melody'; // 값에 따라 멜로디 변화
