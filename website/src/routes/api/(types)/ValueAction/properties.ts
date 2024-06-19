import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        'string',
        'number',
        'bigint',
        'boolean',
        {
          type: 'custom',
          name: 'Date',
        },
      ],
    },
  },
  TRequirement: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'TInput',
    },
  },
  BaseValidation: {
    type: {
      type: 'custom',
      name: 'BaseValidation',
      href: '../BaseValidation/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'value',
    },
  },
  requirement: {
    type: {
      type: 'custom',
      name: 'TRequirement',
    },
  },
};
