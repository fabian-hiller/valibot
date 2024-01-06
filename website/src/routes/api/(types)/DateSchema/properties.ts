import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: [
      {
        type: 'custom',
        name: 'BaseSchema',
        href: '../BaseSchema/',
        generics: [
          {
            type: 'custom',
            name: 'Date',
          },
          {
            type: 'custom',
            name: 'TOutput',
            default: {
              type: 'custom',
              name: 'Date',
            },
          },
        ],
      },
    ],
  },
  type: {
    type: {
      type: 'string',
      value: 'date',
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
        generics: [
          {
            type: 'custom',
            name: 'Date',
          },
        ],
      },
      'undefined',
    ],
  },
};
