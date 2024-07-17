import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ValueInput',
      href: '../ValueInput/',
    },
  },
  TRequirement: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'TInput',
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
      value: 'to_max_value',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'toMaxValue',
      href: '../toMaxValue/',
    },
  },
  requirement: {
    type: {
      type: 'custom',
      name: 'TRequirement',
    },
  },
};
