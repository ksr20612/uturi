import type { DataPoint, SonifierConfig, SonifierMethod } from '../../../typings/sonifier';
import type Oscillator from '../Oscillator';
import { EMPTY_SOUND_RESULT } from './constants/soundResult';
import { FrequencySoundGenerator } from './Frequency/FrequencySoundGenerator';
import { MelodySoundGenerator } from './Melody/MelodySoundGenerator';
import { RhythmSoundGenerator } from './Rhythm/RhythmSoundGenerator';
import { VolumeSoundGenerator } from './Volume/VolumeSoundGenerator';

export default class SoundGenerator {
  private strategy: SoundGeneratorStrategy;

  /*
    TODO
    현재는 각 SoundGenerator의 동작이 복잡하지 않아서 트리셰이킹 등을 고려해 의존성을 외부에서 주입하는 방식으로 구현되어 있지 않음
    이후 동작이 복잡해지면 의존성을 외부에서 주입하는 방식으로 구현해야 할 수 있음
  */
  constructor(method: SonifierMethod) {
    switch (method) {
      case 'volume':
        this.strategy = new VolumeSoundGenerator();
        break;
      case 'rhythm':
        this.strategy = new RhythmSoundGenerator();
        break;
      case 'frequency':
        this.strategy = new FrequencySoundGenerator();
        break;
      case 'melody':
      default:
        this.strategy = new MelodySoundGenerator();
        break;
    }
  }

  generate(
    data: number[],
    config: Required<SonifierConfig>,
    oscillator: Oscillator,
  ): SoundGenerationResult {
    if (data.length === 0) {
      return EMPTY_SOUND_RESULT;
    }

    return this.strategy.generate(data, config, oscillator);
  }
}

export interface SoundGenerationResult {
  audioData: Float32Array;
  dataPoints: DataPoint[];
}

export interface SoundGeneratorStrategy {
  generate(
    data: number[],
    config: Required<SonifierConfig>,
    oscillator: Oscillator,
  ): SoundGenerationResult;
}
