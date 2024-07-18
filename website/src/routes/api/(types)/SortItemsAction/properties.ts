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
  BaseTransformation: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseTransformation',
      href: '../BaseTransformation/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'TInput',
        },
        'never',
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'sort_items',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'sortItems',
      href: '../sortItems/',
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
};
