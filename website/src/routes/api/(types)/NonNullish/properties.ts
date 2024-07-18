import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TValue: {
    modifier: 'extends',
    type: 'any',
  },
  NonNullish: {
    type: {
      type: 'conditional',
      conditions: [
        {
          type: {
            type: 'custom',
            name: 'TValue',
          },
          extends: {
            type: 'union',
            options: ['null', 'undefined'],
          },
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
