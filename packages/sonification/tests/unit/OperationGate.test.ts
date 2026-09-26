import { createOperationGate } from '../../src/shared/createOperationGate';

describe('createOperationGate', () => {
  it('새 호출이 시작되면 이전 호출은 현재 호출이 아니어야 한다', () => {
    const operations = createOperationGate();
    const first = operations.begin();
    const second = operations.begin();

    expect(operations.isCurrent(first)).toBe(false);
    expect(operations.isCurrent(second)).toBe(true);
  });

  it('invalidate 이후에는 진행 중이던 호출이 현재 호출이 아니어야 한다', () => {
    const operations = createOperationGate();
    const current = operations.begin();

    operations.invalidate();

    expect(operations.isCurrent(current)).toBe(false);
  });
});
