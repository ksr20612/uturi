import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Sonifier from '../core/Sonifier';
import type {
  SonifierConfig,
  SonifierMethod,
  SonifierOptions,
  SonifierResult,
} from '../typings/sonification';

/**
 * React hook providing a stable Sonifier instance and helpers
 * for generating and playing audio from numeric data.
 *
 * The Sonifier instance is created only once and reused across renders.
 * Configuration updates do not recreate the instance but apply changes through `setConfig()`.
 *
 * @param initialConfig - Optional initial configuration for the Sonifier instance.
 */
export function useSonifier(initialConfig?: SonifierConfig) {
  const configRef = useRef<SonifierConfig | undefined>(initialConfig);

  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<SonifierResult | null>(null);

  // Stable Sonifier Instance
  const sonifier = useMemo(() => {
    return new Sonifier(configRef.current);
  }, []);

  /**
   * Updates the current Sonifier configuration.
   * This does NOT recreate the instance.
   *
   * @param newConfig - New configuration to apply.
   */
  const setConfig = useCallback(
    (newConfig: SonifierConfig) => {
      configRef.current = newConfig;
      sonifier.setConfig(newConfig);
    },
    [sonifier],
  );

  /**
   * Returns the current effective Sonifier configuration.
   *
   * @returns The active SonifierConfig.
   */
  const getConfig = useCallback(() => {
    return sonifier.getConfig();
  }, [sonifier]);

  /**
   * Converts numeric data into audio via the specified sonification method.
   *
   * @param data - Numeric array used as input values for audio generation.
   * @param method - Sonification method ('melody', 'volume', 'frequency', 'rhythm'). Defaults to `'melody'`.
   * @param options - Optional method-specific overrides.
   *
   * @returns A promise resolving to `SonifierResult`, or `null` on failure.
   *          Sets `result`, `error`, and `isPlaying` state accordingly.
   */
  const sonify = useCallback(
    async (data: number[], method: SonifierMethod = 'melody', options?: SonifierOptions) => {
      setIsPlaying(true);
      setError(null);

      try {
        const res = await sonifier.sonify(data, method, options);
        setResult(res);
        return res;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setResult(null);
        setError(error);
        throw error;
      } finally {
        setIsPlaying(false);
      }
    },
    [sonifier],
  );

  /**
   * Plays a given AudioBuffer through the current Sonifier instance.
   *
   * @param audioBuffer - A Web Audio API AudioBuffer.
   *
   * @throws Error if playback fails.
   */
  const play = useCallback(
    async (audioBuffer: AudioBuffer) => {
      setIsPlaying(true);
      setError(null);

      try {
        await sonifier.play(audioBuffer);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsPlaying(false);
      }
    },
    [sonifier],
  );

  useEffect(() => {
    return () => {
      sonifier.cleanup();
    };
  }, [sonifier]);

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
    getSonifier: () => sonifier,
  };
}
