import { writable, type Writable } from 'svelte/store';
import { onDestroy } from 'svelte';
import Sonifier from '../core/Sonifier';
import { SonificationError, ERROR_CODES } from '../core/errors';
import type {
  SonifierConfig,
  SonifierMethod,
  SonifierOptions,
  SonifierResult,
} from '../typings/sonifier';

/**
 * Svelte composable providing a stable Sonifier instance and helpers
 * for generating and playing audio from numeric data.
 *
 * The Sonifier instance is created immediately and reused across component lifecycle.
 *
 * @param initialConfig - Optional initial configuration for the Sonifier instance.
 * @returns An object containing sonification methods, reactive stores, and configuration helpers.
 */
export function useSonifier(initialConfig?: SonifierConfig) {
  /** Indicates whether a sonify or play operation is in progress */
  const isPlaying: Writable<boolean> = writable(false);

  /** Contains the last error (if any) */
  const error: Writable<SonificationError | null> = writable(null);

  /** Contains the last successful sonification result */
  const result: Writable<SonifierResult | null> = writable(null);

  // Stable Sonifier Instance - always exists
  const sonifierInstance = new Sonifier(initialConfig);

  /**
   * Updates the current Sonifier configuration.
   * This does NOT recreate the instance.
   *
   * @param newConfig - New configuration to apply.
   */
  const setConfig = (newConfig: SonifierConfig): void => {
    sonifierInstance.setConfig(newConfig);
  };

  /**
   * Returns the current effective Sonifier configuration.
   *
   * @returns The active SonifierConfig.
   */
  const getConfig = (): Required<SonifierConfig> => {
    return sonifierInstance.getConfig();
  };

  /**
   * Converts numeric data into audio via the specified sonification method.
   *
   * @param data - Numeric array used as input values for audio generation.
   * @param method - Sonification method ('melody', 'volume', 'frequency', 'rhythm'). Defaults to `'melody'`.
   * @param options - Optional method-specific overrides.
   *
   * @returns A promise resolving to `SonifierResult`.
   *          Updates `result`, `error`, and `isPlaying` stores accordingly.
   *
   * @throws Error if sonification fails.
   */
  const sonify = async (
    data: number[],
    method: SonifierMethod = 'melody',
    options?: SonifierOptions,
  ): Promise<SonifierResult> => {
    isPlaying.set(true);
    error.set(null);

    try {
      const res = await sonifierInstance.sonify(data, method, options);
      result.set(res);
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
      result.set(null);
      error.set(errorObj);
      throw errorObj;
    } finally {
      isPlaying.set(false);
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
    isPlaying.set(true);
    error.set(null);

    try {
      await sonifierInstance.play(audioBuffer);
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
      error.set(errorObj);
      throw errorObj;
    } finally {
      isPlaying.set(false);
    }
  };

  // Cleanup on component destroy
  onDestroy(() => {
    sonifierInstance.cleanup();
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

    /** Indicates whether a sonify or play operation is in progress (Svelte store) */
    isPlaying,
    /** Contains the last error (if any) (Svelte store) */
    error,
    /** Contains the last successful sonification result (Svelte store) */
    result,

    /**
     * Gets the underlying Sonifier instance (if needed for advanced usage).
     * Returns the Sonifier instance directly.
     */
    getSonifier: () => sonifierInstance,
  };
}
