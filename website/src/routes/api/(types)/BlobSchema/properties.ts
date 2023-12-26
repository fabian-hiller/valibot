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
            name: 'Blob',
          },
          {
            type: 'custom',
            name: 'TOutput',
            default: {
              type: 'custom',
              name: 'Blob',
            },
          },
        ],
      },
    ],
  },
  type: {
    type: {
      type: 'string',
      value: 'blob',
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
            name: 'Blob',
          },
        ],
      },
      'undefined',
    ],
  },
};
