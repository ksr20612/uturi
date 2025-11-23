/**
 * Error code constants for the Sonification library
 */
export const ERROR_CODES = {
  /** Error occurred during Web Worker initialization or execution */
  WORKER_ERROR: 'WORKER_ERROR',
  /** Input data or configuration validation failed */
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  /** Audio generation timeout */
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  /** AudioContext related error */
  AUDIO_CONTEXT_ERROR: 'AUDIO_CONTEXT_ERROR',
  /** Unknown error */
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type SonificationErrorCode =
  | typeof ERROR_CODES.WORKER_ERROR
  | typeof ERROR_CODES.VALIDATION_ERROR
  | typeof ERROR_CODES.TIMEOUT_ERROR
  | typeof ERROR_CODES.AUDIO_CONTEXT_ERROR
  | typeof ERROR_CODES.UNKNOWN_ERROR;

/**
 * Base error class for the Sonification library
 *
 * All Sonification-related errors extend or use this class.
 * Error types can be distinguished through error codes.
 */
export class SonificationError extends Error {
  /**
   * Error code - identifier to distinguish error types
   */
  public readonly code: SonificationErrorCode;

  /**
   * Cause error (if any)
   */
  public readonly cause?: Error;

  /**
   * Field name where the error occurred (for validation errors)
   */
  public readonly field?: string;

  constructor(
    message: string,
    code: SonificationErrorCode = ERROR_CODES.UNKNOWN_ERROR,
    options?: {
      cause?: Error;
      field?: string;
    },
  ) {
    super(message);
    this.name = 'SonificationError';
    this.code = code;
    this.cause = options?.cause;
    this.field = options?.field;

    // Error.cause support (Node.js 16.9.0+, Chrome 93+)
    if (options?.cause && 'cause' in Error.prototype) {
      (this as Error & { cause: Error }).cause = options.cause;
    }

    // Preserve stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SonificationError);
    }
  }
}
