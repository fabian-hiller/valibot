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
  ObjectKeys: {
    type: {
      type: 'custom',
      name: 'MaybeReadonly',
      href: '../MaybeReadonly/',
      generics: [
        {
          type: 'tuple',
          items: [
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
            {
              type: 'array',
              spread: true,
              item: {
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
            },
          ],
        },
      ],
    },
  },
};
