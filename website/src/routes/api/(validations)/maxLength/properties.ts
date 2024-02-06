import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'string',
          value: 'string',
        },
        {
          type: 'array',
          item: 'any',
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
      value: 'Invalid length',
    },
  },
  validation: {
    type: {
      type: 'custom',
      name: 'MaxLengthValidation',
      href: '../MaxLengthValidation/',
    },
  },
};
