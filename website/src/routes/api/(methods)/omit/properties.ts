import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ObjectSchema',
      href: '../ObjectSchema/',
      generics: ['any', 'any'],
    },
  },
  TKeys: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ObjectKeys',
      href: '../ObjectKeys/',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
      ],
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
  schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
  keys: {
    type: {
      type: 'custom',
      name: 'TKey',
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
                  name: 'Omit',
                  generics: [
                    {
                      type: 'custom',
                      name: 'TSchema',
                      indexes: [
                        {
                          type: 'string',
                          value: 'entries',
                        },
                      ],
                    },
                    {
                      type: 'custom',
                      name: 'TKeys',
                      indexes: ['number'],
                    },
                  ],
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
      generics: [
        {
          type: 'custom',
          name: 'Omit',
          generics: [
            {
              type: 'custom',
              name: 'TSchema',
              indexes: [
                {
                  type: 'string',
                  value: 'entries',
                },
              ],
            },
            {
              type: 'custom',
              name: 'TKeys',
              indexes: ['number'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'TRest',
        },
      ],
    },
  },
};
