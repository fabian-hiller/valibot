import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'string',
  },
  types: {
    type: {
      type: 'tuple',
      items: [
        {
          type: 'custom',
          name: 'HashType',
          href: '../HashType/',
        },
        {
          type: 'array',
          spread: true,
          item: {
            type: 'custom',
            name: 'HashType',
            href: '../HashType/',
          },
        },
      ],
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
    default: {
      type: 'string',
      value: 'Invalid hash',
    },
  },
  Validation: {
    type: {
      type: 'custom',
      name: 'HashValidation',
      href: '../HashValidation/',
    },
  },
};
