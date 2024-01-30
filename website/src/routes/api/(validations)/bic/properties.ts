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
    default: {
      type: 'string',
      value: 'Invalid bic',
    },
  },
  Validation: {
    type: {
      type: 'custom',
      name: 'BicValidation',
      href: '../BicValidation/',
    },
  },
};
