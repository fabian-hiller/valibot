import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  PartialKeySchema: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'EnumSchema',
          href: '../EnumSchema/',
          generics: ['any'],
        },
        {
          type: 'custom',
          name: 'EnumSchemaAsync',
          href: '../EnumSchemaAsync/',
          generics: ['any'],
        },
        {
          type: 'custom',
          name: 'PicklistSchema',
          href: '../PicklistSchema/',
          generics: ['any'],
        },
        {
          type: 'custom',
          name: 'PicklistSchemaAsync',
          href: '../PicklistSchemaAsync/',
          generics: ['any'],
        },
        {
          type: 'custom',
          name: 'UnionSchema',
          href: '../UnionSchema/',
          generics: ['any'],
        },
        {
          type: 'custom',
          name: 'UnionSchemaAsync',
          href: '../UnionSchemaAsync/',
          generics: ['any'],
        },
      ],
    },
  },
};
