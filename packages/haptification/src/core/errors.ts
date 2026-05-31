export const ERROR_CODES = {
  DRIVER_NOT_SUPPORTED: 'DRIVER_NOT_SUPPORTED',
  INVALID_DATA: 'INVALID_DATA',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type HaptificationErrorCode =
  | typeof ERROR_CODES.DRIVER_NOT_SUPPORTED
  | typeof ERROR_CODES.INVALID_DATA
  | typeof ERROR_CODES.UNKNOWN_ERROR;

export class HaptificationError extends Error {
  public readonly code: HaptificationErrorCode;
  public readonly cause?: Error;

  constructor(
    message: string,
    code: HaptificationErrorCode = ERROR_CODES.UNKNOWN_ERROR,
    options?: { cause?: Error },
  ) {
    super(message);
    this.name = 'HaptificationError';
    this.code = code;
    this.cause = options?.cause;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HaptificationError);
    }
  }
}
