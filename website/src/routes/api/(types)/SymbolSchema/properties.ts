import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: [
      {
        type: 'custom',
        name: 'BaseSchema',
        href: '../BaseSchema/',
        generics: [
          'symbol',
          {
            type: 'custom',
            name: 'TOutput',
            default: 'symbol',
          },
        ],
      },
    ],
  },
  type: {
    type: {
      type: 'string',
      value: 'symbol',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'ErrorMessage',
      href: '../ErrorMessage/',
    },
  },
  pipe: {
    type: [
      {
        type: 'custom',
        name: 'Pipe',
        href: '../Pipe/',
        generics: ['symbol'],
      },
      'undefined',
    ],
  },
};
