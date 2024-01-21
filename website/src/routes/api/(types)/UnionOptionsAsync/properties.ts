import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  UnionOptionsAsync: {
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
              },
              {
                type: 'custom',
                name: 'BaseSchemaAsync',
                href: '../BaseSchemaAsync/',
              },
            ],
          },
        },
      ],
    },
  },
};
