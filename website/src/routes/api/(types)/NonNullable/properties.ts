import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TValue: {
    modifier: 'extends',
    type: 'any',
  },
  NonNullable: {
    type: {
      type: 'conditional',
      conditions: [
        {
          type: {
            type: 'custom',
            name: 'TValue',
          },
          extends: 'null',
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
