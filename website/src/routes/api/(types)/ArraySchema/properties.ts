import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: {
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
          type: 'custom',
          name: 'TOutput',
          default: {
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
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'array',
    },
  },
  item: {
    type: {
      type: 'custom',
      name: 'TItem',
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
    type: {
      type: 'union',
      options: [
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
  },
};
