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
            type: 'array',
            item: {
              type: 'custom',
              name: 'Input',
              href: '../Input/',
              generics: [
                {
                  type: 'custom',
                  name: 'TItem',
                },
              ],
            },
          },

          {
            type: 'array',
            item: {
              type: 'custom',
              name: 'TOutput',
              generics: [
                {
                  type: 'custom',
                  name: 'TItem',
                },
              ],
              default: {
                type: 'custom',
                name: 'Output',
                href: '../Output/',
              },
            },
          },
        ],
      },
    ],
  },
  message: {
    type: {
      type: 'custom',
      name: 'ErrorMessage',
      href: '../ErrorMessage/',
    },
  },
  item: {
    type: [
      {
        type: 'custom',
        name: 'TItem',
      },
    ],
  },
  type: {
    type: {
      type: 'string',
      value: 'array',
    },
  },
  pipe: {
    type: [
      {
        type: 'custom',
        name: 'Pipe',
        href: '../Pipe/',
        generics: ['array'],
      },
      'undefined',
    ],
  },
};
