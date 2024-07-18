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
          type: 'array',
          item: {
            type: 'custom',
            name: 'TOuput',
          },
        },
        'never',
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'map_items',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'mapItems',
      href: '../mapItems/',
    },
  },
  operation: {
    type: {
      type: 'function',
      params: [
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
};
