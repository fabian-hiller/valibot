import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ArrayInput',
      href: '../ArrayInput/',
    },
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
          name: 'output',
          type: {
            type: 'custom',
            name: 'TOutput',
          },
        },
        {
          name: 'item',
          type: {
            type: 'custom',
            name: 'TInput',
            indexes: ['number'],
          },
        },
        {
          name: 'index',
          type: 'number',
        },
        {
          name: 'array',
          type: {
            type: 'custom',
            name: 'TInput',
          },
        },
      ],
      return: {
        type: 'custom',
        name: 'TOutput',
      },
    },
  },
  initial: {
    type: {
      type: 'custom',
      name: 'TOutput',
    },
  },
  Action: {
    type: {
      type: 'custom',
      name: 'ReduceItemsAction',
      href: '../ReduceItemsAction/',
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
