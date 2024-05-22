import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'number',
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
      name: 'FiniteValidation',
      href: '../FiniteValidation/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
};
