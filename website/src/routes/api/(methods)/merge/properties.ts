import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchemas: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ObjectSchemas',
      href: '../ObjectSchemas/',
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
  schemas: {
    type: {
      type: 'custom',
      name: 'TSchema',
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
                  name: 'MergeObjects',
                  generics: [
                    {
                      type: 'custom',
                      name: 'TSchemas',
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
          name: 'MergeObjects',
          generics: [
            {
              type: 'custom',
              name: 'TSchemas',
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
