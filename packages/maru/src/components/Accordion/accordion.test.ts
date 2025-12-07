import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import accordionMachine from '@components/Accordion/accordion.machine';

describe('accordionMachine', () => {
  it('should start in "closed" state', () => {
    const actor = createActor(accordionMachine).start();
    expect(actor.getSnapshot().value).toBe('closed');
  });

  it('should toggle from closed to open', () => {
    const actor = createActor(accordionMachine).start();

    actor.send({ type: 'TOGGLE' });

    expect(actor.getSnapshot().value).toBe('open');
  });

  // TODO: 테스트 동작 수정
  //   it('should not toggle when disabled', () => {
  //     const actor = createActor(accordionMachine, {
  //       input: {
  //         disabled: true,
  //       },
  //     }).start();

  //     actor.send({ type: 'TOGGLE' });

  //     expect(actor.getSnapshot().value).toBe('closed');
  //   });
});
