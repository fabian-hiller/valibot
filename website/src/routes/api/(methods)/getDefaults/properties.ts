import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'SchemaWithMaybeDefault',
      href: '../SchemaWithMaybeDefault/',
      generics: [
        {
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'BaseSchema',
            },
            {
              type: 'custom',
              name: 'ObjectSchema',
              href: '../ObjectSchema/',
              generics: [
                {
                  type: 'custom',
                  name: 'ObjectEntries',
                },
                'any',
              ],
            },
            {
              type: 'custom',
              name: 'TupleSchema',
              href: '../TupleSchema/',
              generics: [
                {
                  type: 'custom',
                  name: 'TupleItems',
                },
                'any',
              ],
            },
          ],
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
  values: {
    type: {
      type: 'custom',
      name: 'DefaultValues',
      href: '../DefaultValues/',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
      ],
    },
  },
};
