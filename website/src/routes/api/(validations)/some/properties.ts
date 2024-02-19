import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'array',
      item: 'any',
    },
  },
  requirement: {
    type: {
      type: 'function',
      params: [
        {
          name: 'input',
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
            type: 'array',
            item: {
              type: 'custom',
              name: 'TInput',
              indexes: ['number'],
            },
          },
        },
      ],
      return: 'boolean',
    },
  },
  message: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ErrorMessage',
          href: '../ErrorMessage/',
        },
        'undefined',
      ],
    },
  },
  Validation: {
    type: {
      type: 'custom',
      name: 'SomeValidation',
      href: '../SomeValidation/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
};
