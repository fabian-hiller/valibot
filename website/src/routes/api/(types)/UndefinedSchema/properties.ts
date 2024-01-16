import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: [
      {
        type: 'custom',
        name: 'BaseSchema',
        href: '../BaseSchema/',
        generics: [
          'undefined',
          {
            type: 'custom',
            name: 'TOutput',
            default: 'undefined',
          },
        ],
      },
    ],
  },
  type: {
    type: {
      type: 'string',
      value: 'undefined',
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
