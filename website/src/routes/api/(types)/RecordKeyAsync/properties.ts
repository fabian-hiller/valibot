import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  RecordKeyAsync: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'EnumSchema',
          href: '../EnumSchema/',
          generics: [
            'any',
            {
              type: 'union',
              options: ['string', 'number', 'symbol'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'EnumSchemaAsync',
          href: '../EnumSchemaAsync/',
          generics: [
            'any',
            {
              type: 'union',
              options: ['string', 'number', 'symbol'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'PicklistSchema',
          href: '../PicklistSchema/',
          generics: [
            'any',
            {
              type: 'union',
              options: ['string', 'number', 'symbol'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'PicklistSchemaAsync',
          href: '../PicklistSchemaAsync/',
          generics: [
            'any',
            {
              type: 'union',
              options: ['string', 'number', 'symbol'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'SpecialSchema',
          href: '../SpecialSchema/',
          generics: [
            'any',
            {
              type: 'union',
              options: ['string', 'number', 'symbol'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'SpecialSchemaAsync',
          href: '../SpecialSchemaAsync/',
          generics: [
            'any',
            {
              type: 'union',
              options: ['string', 'number', 'symbol'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'StringSchema',
          href: '../StringSchema/',
          generics: [
            {
              type: 'union',
              options: ['string', 'number', 'symbol'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'StringSchemaAsync',
          href: '../StringSchemaAsync/',
          generics: [
            {
              type: 'union',
              options: ['string', 'number', 'symbol'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'UnionSchema',
          href: '../UnionSchema/',
          generics: [
            'any',
            {
              type: 'union',
              options: ['string', 'number', 'symbol'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'UnionSchemaAsync',
          href: '../UnionSchemaAsync/',
          generics: [
            'any',
            {
              type: 'union',
              options: ['string', 'number', 'symbol'],
            },
          ],
        },
      ],
    },
  },
};
