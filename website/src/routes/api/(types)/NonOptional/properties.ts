import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TValue: {
    modifier: 'extends',
    type: 'any',
  },
  NonOptional: {
    type: {
      type: 'conditional',
      conditions: [
        {
          type: {
            type: 'custom',
            name: 'TValue',
          },
          extends: 'undefined',
          true: 'never',
        },
      ],
      false: {
        type: 'custom',
        name: 'TValue',
      },
    },
  },
};
