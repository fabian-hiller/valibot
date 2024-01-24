import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TEntries: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ObjectEntries',
      href: '../ObjectEntries/',
    },
  },
  TRest: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'BaseSchema',
          href: '../BaseSchema/',
        },
        'undefined',
      ],
    },
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
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
