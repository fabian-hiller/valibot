import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
  },
  operation: {
    type: {
      type: 'function',
      params: [
        {
          name: 'input',
          type: {
            type: 'custom',
            name: 'TInput',
          },
        },
      ],
      return: {
        type: 'custom',
        name: 'Promise',
        generics: [
          {
            type: 'custom',
            name: 'TOutput',
          },
        ],
      },
    },
  },
  Action: {
    type: {
      type: 'custom',
      name: 'TransformActionAsync',
      href: '../TransformActionAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'TOutput',
        },
      ],
    },
  },
};
