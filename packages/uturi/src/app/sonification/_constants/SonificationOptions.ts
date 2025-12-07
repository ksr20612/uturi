import { createListCollection } from '@chakra-ui/react';
import type { SonifierConfig } from '@uturi/sonification';

// export type WaveType = 'sine' | 'square' | 'sawtooth';

export const enum SonificationMethod {
  FREQUENCY = 'frequency',
  VOLUME = 'volume',
  RHYTHM = 'rhythm',
  MELODY = 'melody',
}

export const enum WaveformType {
  SINE = 'sine',
  SQUARE = 'square',
  SAWTOOTH = 'sawtooth',
}

export const DEFAULT_CONFIG = {
  sampleRate: 44100,
  duration: 2.0,
  waveType: WaveformType.SINE,
  frequency: 825,
  minFrequency: 150,
  maxFrequency: 1500,
  volume: 0.3,
  minVolume: 0.1,
  maxVolume: 0.5,
  rhythm: 0.5,
  minRhythm: 0.1,
  maxRhythm: 1,
} satisfies SonifierConfig & { waveType?: WaveformType };

export const SONIFICATION_LIST_COLLECTION = createListCollection({
  items: [
    { label: 'Pitch Variation', value: SonificationMethod.FREQUENCY },
    { label: 'Volume Variation', value: SonificationMethod.VOLUME },
    { label: 'Rhythm Variation', value: SonificationMethod.RHYTHM },
    { label: 'Melody Variation', value: SonificationMethod.MELODY },
  ],
});

export const WAVEFORM_LIST_COLLECTION = createListCollection({
  items: [
    { label: 'Sine', value: WaveformType.SINE },
    { label: 'Square', value: WaveformType.SQUARE },
    { label: 'Sawtooth', value: WaveformType.SAWTOOTH },
  ],
});
