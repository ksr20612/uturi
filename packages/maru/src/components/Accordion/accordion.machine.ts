import { createMachine } from 'xstate';
import freeze from '@utils/freeze/freeze';

const ACCORDION_MACHINE_SYMBOL = Symbol('ACCORDION_MACHINE');

const accordionMachine = createMachine(
  {
    id: 'accordion',
    initial: 'closed',
    context: {
      disabled: false,
    },
    states: {
      closed: {
        on: {
          TOGGLE: {
            target: 'open',
            guard: 'isEnabled',
          },
        },
      },
      open: {
        on: {
          TOGGLE: {
            target: 'closed',
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

export default freeze(accordionMachine, ACCORDION_MACHINE_SYMBOL);
