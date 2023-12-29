import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TItem: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
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
  message: {
    type: [
      {
        type: 'custom',
        name: 'ErrorMessage',
        href: '../ErrorMessage/',
      },
      'undefined',
    ],
    default: {
      type: 'string',
      value: 'Invalid type',
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
            type: 'array',
            item: {
              type: 'custom',
              name: 'Output',
              href: '../Output/',
              generics: [
                {
                  type: 'custom',
                  name: 'TItem',
                },
              ],
            },
          },
        ],
      },
      'undefined',
    ],
  },
  Schema: {
    type: [
      {
        type: 'custom',
        name: 'ArraySchema',
        href: '../ArraySchema/',
      },
    ],
  },
};
