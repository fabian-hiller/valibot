import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ContentInput',
      href: '../ContentInput/',
    },
  },
  ContentRequirement: {
    type: {
      type: 'conditional',
      conditions: [
        {
          type: {
            type: 'custom',
            name: 'TInput',
          },
          extends: {
            type: 'array',
            modifier: 'readonly',
            item: 'unknown',
          },
          true: {
            type: 'custom',
            name: 'TInput',
            indexes: ['number'],
          },
        },
      ],
      false: {
        type: 'custom',
        name: 'TInput',
      },
    },
  },
};
