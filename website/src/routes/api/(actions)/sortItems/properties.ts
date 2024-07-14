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
  operation: {
    type: {
      type: 'union',
      options: [
        {
          type: 'function',
          params: [
            {
              name: 'itemA',
              type: {
                type: 'custom',
                name: 'TInput',
                indexes: ['number'],
              },
            },
            {
              name: 'itemB',
              type: {
                type: 'custom',
                name: 'TInput',
                indexes: ['number'],
              },
            },
          ],
          return: 'number',
        },
        'undefined',
      ],
    },
  },
  Action: {
    type: {
      type: 'custom',
      name: 'SortItemsAction',
      href: '../SortItemsAction/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
};
