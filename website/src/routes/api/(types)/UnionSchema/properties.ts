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
            name: 'Input',
            href: '../Input/',
            generics: [
              {
                type: 'custom',
                name: 'TOptions',
                href: '../TOptions/',
                indexes: ['number'],
              },
            ],
          },
          {
            type: 'custom',
            name: 'TOutput',
            default: {
              type: 'custom',
              name: 'Output',
              href: '../Output/',
              generics: [
                {
                  type: 'custom',
                  name: 'TOptions',
                  href: '../TOptions/',
                  indexes: ['number'],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  type: {
    type: {
      type: 'string',
      value: 'union',
    },
  },
  options: {
    type: [
      {
        type: 'custom',
        name: 'TOptions',
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
  pipe: {
    type: [
      {
        type: 'custom',
        name: 'Pipe',
        href: '../Pipe/',
        generics: [
          {
            type: 'custom',
            name: 'Output',
            href: '../Output/',
            generics: [
              {
                type: 'custom',
                name: 'TOptions',
                href: '../TOptions/',
                indexes: ['number'],
              },
            ],
          },
        ],
      },
      'undefined',
    ],
  },
};
