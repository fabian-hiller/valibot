import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseValidation: {
    type: [
      {
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
    ],
  },
  type: {
    type: {
      type: 'string',
      value: 'email',
    },
  },
  requirement: {
    type: {
      type: 'custom',
      name: 'RegExp',
    },
  },
};
