export interface HaptifierConfig {
  method?: HaptifierMethod;
  duration?: HapticRangeConfig;
  pause?: HapticRangeConfig;
  driver?: VibrationDriver;
}

export interface HapticRangeConfig {
  min: number;
  max: number;
}

export type HaptifierMethod = 'pulse' | 'rhythm' | 'wave';

export interface HapticFrame {
  intensity: number;
  duration: number;
  pause: number;
}

export type HapticSequence = HapticFrame[];

export interface VibrationDriver {
  play(sequence: HapticSequence): Promise<void>;
  stop(): void;
  isSupported(): boolean;
}
