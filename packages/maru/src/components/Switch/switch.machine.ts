import { createMachine } from 'xstate';
import freeze from '@utils/freeze/freeze';

const SWITCH_MACHINE_SYMBOL = Symbol('SWITCH_MACHINE');

const switchMachine = createMachine(
  {
    id: 'switch',
    initial: 'off',
    context: {
      disabled: false,
    },
    states: {
      off: {
        on: {
          TOGGLE: {
            target: 'on',
            guard: 'isEnabled',
          },
        },
      },
      on: {
        on: {
          TOGGLE: {
            target: 'off',
            guard: 'isEnabled',
          },
        },
      },
    },
  },
  {
    guards: {
      isEnabled: ({ context }) => !context.disabled,
    },
  },
);

export default freeze(switchMachine, SWITCH_MACHINE_SYMBOL);
