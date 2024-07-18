import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TupleItemsAsync: {
    type: {
      type: 'custom',
      name: 'MaybeReadonly',
      href: '../MaybeReadonly/',
      generics: [
        {
          type: 'array',
          item: {
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
      ],
    },
  },
};
