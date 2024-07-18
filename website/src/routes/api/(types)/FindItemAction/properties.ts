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
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'TInput',
              indexes: ['number'],
            },
            'undefined',
          ],
        },
        'never',
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'find_item',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'findItem',
      href: '../findItem/',
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
