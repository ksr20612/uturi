/**
 * Tracks the latest sonify/play call so an older call cannot clear playback state.
 */
export interface OperationGate {
  begin(): number;
  invalidate(): void;
  isCurrent(operationId: number): boolean;
}

export function createOperationGate(): OperationGate {
  let currentOperationId = 0;

  return {
    begin() {
      currentOperationId += 1;
      return currentOperationId;
    },
    invalidate() {
      currentOperationId += 1;
    },
    isCurrent(operationId: number) {
      return operationId === currentOperationId;
    },
  };
}
