import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: [
      {
        type: 'custom',
        name: 'BaseSchema',
        href: '../BaseSchema/',
        generics: [
          'void',
          {
            type: 'custom',
            name: 'TOutput',
            default: 'void',
          },
        ],
      },
    ],
  },
  type: {
    type: {
      type: 'string',
      value: 'void',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'ErrorMessage',
      href: '../ErrorMessage/',
    },
  },
};
