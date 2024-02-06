import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    type: 'string',
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
  validation: {
    type: {
      type: 'custom',
      name: 'EmailValidation',
      href: '../EmailValidation/',
    },
  },
};
