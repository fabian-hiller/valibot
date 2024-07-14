import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TList: {
    modifier: 'extends',
    type: {
      type: 'array',
      item: {
        type: 'union',
        options: ['string', 'number', 'symbol'],
      },
    },
  },
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'BaseSchema',
          href: '../BaseSchema/',
          generics: [
            'unknown',
            'unknown',
            {
              type: 'custom',
              name: 'BaseIssue',
              href: '../BaseIssue/',
              generics: ['unknown'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'BaseSchemaAsync',
          href: '../BaseSchemaAsync/',
          generics: [
            'unknown',
            'unknown',
            {
              type: 'custom',
              name: 'BaseIssue',
              href: '../BaseIssue/',
              generics: ['unknown'],
            },
          ],
        },
      ],
    },
  },
  list: {
    type: {
      type: 'custom',
      name: 'TList',
    },
  },
  schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
  entries: {
    type: {
      type: 'custom',
      name: 'Record',
      generics: [
        {
          type: 'custom',
          name: 'TList',
          indexes: ['number'],
        },
        {
          type: 'custom',
          name: 'TSchema',
        },
      ],
    },
  },
};
