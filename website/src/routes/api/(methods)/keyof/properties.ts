import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ObjectSchema',
          href: '../ObjectSchema/',
          generics: ['any', 'any'],
        },
        {
          type: 'custom',
          name: 'ObjectSchemaAsync',
          href: '../ObjectSchemaAsync/',
          generics: ['any', 'any'],
        },
      ],
    },
  },
  schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'PicklistSchema',
      href: '../PicklistSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TupleOrNever',
          generics: [
            {
              type: 'custom',
              name: 'UnionToTuple',
              generics: [
                {
                  type: 'custom',
                  modifier: 'keyof',
                  name: 'TSchema',
                  indexes: [
                    {
                      type: 'string',
                      value: 'entries',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
