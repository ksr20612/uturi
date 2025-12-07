import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import switchMachine from '@components/Switch/switch.machine';

describe('switchMachine', () => {
  it('should start in "off" state', () => {
    const actor = createActor(switchMachine).start();
    expect(actor.getSnapshot().value).toBe('off');
  });

  it('should toggle from off to on', () => {
    const actor = createActor(switchMachine).start();

    actor.send({ type: 'TOGGLE' });

    expect(actor.getSnapshot().value).toBe('on');
  });

  // TODO: 테스트 동작 수정
  //   it('should not toggle when disabled', () => {
  //     const actor = createActor(switchMachine, {
  //       input: {
  //         disabled: true,
  //       },
  //     }).start();

  //     actor.send({ type: 'TOGGLE' });

  //     expect(actor.getSnapshot().value).toBe('off');
  //   });
});
