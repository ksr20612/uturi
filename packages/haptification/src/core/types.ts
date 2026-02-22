export type HapticFrame = {
  intensity: number;
  duration: number;
  pause: number;
};

export type HapticSequence = HapticFrame[];

export type HapticMethod = 'pulse' | 'rhythm' | 'wave';

export type HapticRangeConfig = {
  min: number;
  max: number;
};

export type HapticConfig = {
  method?: HapticMethod;
  duration?: HapticRangeConfig;
  pause?: HapticRangeConfig;
  driver?: VibrationDriver;
};

export interface VibrationDriver {
  play(sequence: HapticSequence): Promise<void>;
  stop(): void;
  isSupported(): boolean;
}

export interface HapticEngine {
  play(data: number[]): Promise<void>;
  playAudio(audio: AudioBuffer): Promise<void>;
  playSequence(sequence: HapticSequence): Promise<void>;
  toSequence(data: number[]): HapticSequence;
  stop(): void;
  isSupported(): boolean;
}
