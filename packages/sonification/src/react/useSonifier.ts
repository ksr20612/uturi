import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Sonifier from '../core/Sonifier';
import { SonificationError, ERROR_CODES } from '../core/errors';
import { createOperationGate } from '../shared/createOperationGate';
import type {
  SonifierConfig,
  SonifierMethod,
  SonifierOptions,
  SonifierResult,
} from '../typings/sonifier';

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
  const operations = useMemo(() => createOperationGate(), []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<SonificationError | null>(null);
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
      const operationId = operations.begin();
      setIsPlaying(true);
      setError(null);

      try {
        const res = await sonifier.sonify(data, method, options);
        if (operations.isCurrent(operationId)) {
          setResult(res);
        }
        return res;
      } catch (err) {
        // 모든 에러를 SonificationError로 통일
        const error =
          err instanceof SonificationError
            ? err
            : new SonificationError(
                err instanceof Error ? err.message : String(err),
                ERROR_CODES.UNKNOWN_ERROR,
                { cause: err instanceof Error ? err : undefined },
              );
        if (operations.isCurrent(operationId)) {
          setResult(null);
          setError(error);
        }
        throw error;
      } finally {
        if (operations.isCurrent(operationId)) {
          setIsPlaying(false);
        }
      }
    },
    [operations, sonifier],
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
      const operationId = operations.begin();
      setIsPlaying(true);
      setError(null);

      try {
        await sonifier.play(audioBuffer);
      } catch (err) {
        // 모든 에러를 SonificationError로 통일
        const error =
          err instanceof SonificationError
            ? err
            : new SonificationError(
                err instanceof Error ? err.message : String(err),
                ERROR_CODES.UNKNOWN_ERROR,
                { cause: err instanceof Error ? err : undefined },
              );
        if (operations.isCurrent(operationId)) {
          setError(error);
        }
        throw error;
      } finally {
        if (operations.isCurrent(operationId)) {
          setIsPlaying(false);
        }
      }
    },
    [operations, sonifier],
  );

  /**
   * Stops the currently playing audio, if any.
   * Does not cancel in-flight audio generation, but skips autoPlay and clears the playing state.
   */
  const stop = useCallback(() => {
    operations.invalidate();
    setIsPlaying(false);
    sonifier.stop();
  }, [operations, sonifier]);

  useEffect(() => {
    return () => {
      operations.invalidate();
      sonifier.cleanup();
    };
  }, [operations, sonifier]);

  return {
    /** Generates audio from numeric data */
    sonify,
    /** Plays an AudioBuffer */
    play,
    /** Stops the currently playing audio */
    stop,
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
