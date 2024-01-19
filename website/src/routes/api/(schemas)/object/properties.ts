import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TEntries: {
    type: {
      type: 'custom',
      name: 'ObjectEntries',
      href: '../ObjectEntries/',
    },
  },
  TRest: {
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
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ErrorMessage',
          href: '../ErrorMessage/',
        },
        'undefined',
      ],
    },
    default: {
      type: 'string',
      value: 'Invalid type',
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
  Schema: {
    type: {
      type: 'custom',
      name: 'ObjectSchema',
      href: '../ObjectSchema/',
    },
  },
};
