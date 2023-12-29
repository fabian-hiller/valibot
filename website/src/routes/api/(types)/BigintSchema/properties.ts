import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: [
      {
        type: 'custom',
        name: 'BaseSchema',
        href: '../BaseSchema/',
        generics: [
          'bigint',
          {
            type: 'custom',
            name: 'TOutput',
            default: 'bigint',
          },
        ],
      },
    ],
  },
  type: {
    type: {
      type: 'string',
      value: 'bigint',
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
        generics: ['bigint'],
      },
      'undefined',
    ],
  },
};
