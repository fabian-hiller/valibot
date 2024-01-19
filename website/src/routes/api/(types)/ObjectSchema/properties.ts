import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        {
          type: 'custom',
          name: 'ObjectInput',
          href: '../ObjectInput/',
          generics: [
            {
              type: 'custom',
              name: 'TEntries',
            },
            {
              type: 'custom',
              name: 'TRest',
            },
          ],
        },
        {
          type: 'custom',
          name: 'TOutput',
          default: {
            type: 'custom',
            name: 'ObjectOutput',
            href: '../ObjectOutput/',
            generics: [
              {
                type: 'custom',
                name: 'TEntries',
              },
              {
                type: 'custom',
                name: 'TRest',
              },
            ],
          },
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'object',
    },
  },
  entries: {
    type: {
      type: 'custom',
      name: 'TEntries',
    },
  },
  rest: {
    type: {
      type: 'custom',
      name: 'TRest',
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
              type: 'custom',
              name: 'ObjectOutput',
              href: '../ObjectOutput/',
              generics: [
                {
                  type: 'custom',
                  name: 'TEntries',
                },
                {
                  type: 'custom',
                  name: 'TRest',
                },
              ],
            },
          ],
        },
        'undefined',
      ],
    },
  },
};
