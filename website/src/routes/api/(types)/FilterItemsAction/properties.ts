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
      value: 'filter_items',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'filterItems',
      href: '../filterItems/',
    },
  },
  operation: {
    type: {
      type: 'custom',
      name: 'ArrayRequirement',
      href: '../ArrayRequirement/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
};
