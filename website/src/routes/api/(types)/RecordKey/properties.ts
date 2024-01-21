import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  RecordKey: {
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
      ],
    },
  },
};
