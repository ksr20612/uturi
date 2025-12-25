import { ref, onUnmounted } from 'vue';
import Sonifier from '../core/Sonifier';
import { SonificationError, ERROR_CODES } from '../core/errors';
import type {
  SonifierConfig,
  SonifierMethod,
  SonifierOptions,
  SonifierResult,
} from '../typings/sonifier';

/**
 * Vue composable providing a stable Sonifier instance and helpers
 * for generating and playing audio from numeric data.
 *
 * The Sonifier instance is created only once and reused across component lifecycle.
 * Configuration updates do not recreate the instance but apply changes through `setConfig()`.
 *
 * @param initialConfig - Optional initial configuration for the Sonifier instance.
 * @returns An object containing sonification methods, state, and configuration helpers.
 */
export function useSonifier(initialConfig?: SonifierConfig) {
  /** Indicates whether a sonify or play operation is in progress */
  const isPlaying = ref(false);

  /** Contains the last error (if any) */
  const error = ref<SonificationError | null>(null);

  /** Contains the last successful sonification result */
  const result = ref<SonifierResult | null>(null);

  // Stable Sonifier Instance - created once and reused
  const sonifierInstance = ref(new Sonifier(initialConfig));

  /**
   * Updates the current Sonifier configuration.
   * This does NOT recreate the instance.
   *
   * @param newConfig - New configuration to apply.
   */
  const setConfig = (newConfig: SonifierConfig): void => {
    sonifierInstance.value.setConfig(newConfig);
  };

  /**
   * Returns the current effective Sonifier configuration.
   *
   * @returns The active SonifierConfig.
   */
  const getConfig = (): Required<SonifierConfig> => {
    return sonifierInstance.value.getConfig();
  };

  /**
   * Converts numeric data into audio via the specified sonification method.
   *
   * @param data - Numeric array used as input values for audio generation.
   * @param method - Sonification method ('melody', 'volume', 'frequency', 'rhythm'). Defaults to `'melody'`.
   * @param options - Optional method-specific overrides.
   *
   * @returns A promise resolving to `SonifierResult`.
   *          Sets `result`, `error`, and `isPlaying` state accordingly.
   *
   * @throws Error if sonification fails.
   */
  const sonify = async (
    data: number[],
    method: SonifierMethod = 'melody',
    options?: SonifierOptions,
  ): Promise<SonifierResult> => {
    isPlaying.value = true;
    error.value = null;

    try {
      const res = await sonifierInstance.value.sonify(data, method, options);
      result.value = res;
      return res;
    } catch (err) {
      // 모든 에러를 SonificationError로 통일
      const errorObj =
        err instanceof SonificationError
          ? err
          : new SonificationError(
              err instanceof Error ? err.message : String(err),
              ERROR_CODES.UNKNOWN_ERROR,
              { cause: err instanceof Error ? err : undefined },
            );
      result.value = null;
      error.value = errorObj;
      throw errorObj;
    } finally {
      isPlaying.value = false;
    }
  };

  /**
   * Plays a given AudioBuffer through the current Sonifier instance.
   *
   * @param audioBuffer - A Web Audio API AudioBuffer.
   *
   * @throws Error if playback fails.
   */
  const play = async (audioBuffer: AudioBuffer): Promise<void> => {
    isPlaying.value = true;
    error.value = null;

    try {
      await sonifierInstance.value.play(audioBuffer);
    } catch (err) {
      // 모든 에러를 SonificationError로 통일
      const errorObj =
        err instanceof SonificationError
          ? err
          : new SonificationError(
              err instanceof Error ? err.message : String(err),
              ERROR_CODES.UNKNOWN_ERROR,
              { cause: err instanceof Error ? err : undefined },
            );
      error.value = errorObj;
      throw errorObj;
    } finally {
      isPlaying.value = false;
    }
  };

  onUnmounted(() => {
    sonifierInstance.value.cleanup();
  });

  return {
    /** Generates audio from numeric data */
    sonify,
    /** Plays an AudioBuffer */
    play,
    /** Returns current configuration */
    getConfig,
    /** Updates Sonifier configuration */
    setConfig,

    /** Indicates whether a sonify or play operation is in progress */
    isPlaying,
    /** Contains the last error (if any) */
    error,
    /** Contains the last successful sonification result */
    result,

    /**
     * Gets the underlying Sonifier instance (if needed for advanced usage).
     * Returns the Sonifier instance directly.
     */
    getSonifier: () => sonifierInstance.value,
  };
}
