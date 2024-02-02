import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
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
      value: 'Invalid 64-bit MAC',
    },
  },
  validation: {
    type: {
      type: 'custom',
      name: 'Mac64Validation',
      href: '../Mac64Validation/',
    },
  },
};
