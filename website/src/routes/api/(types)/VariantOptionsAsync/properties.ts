import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TKey: {
    modifier: 'extends',
    type: 'string',
  },
  VariantOptionsAsync: {
    type: {
      type: 'custom',
      name: 'MaybeReadonly',
      href: '../MaybeReadonly/',
      generics: [
        {
          type: 'union',
          options: [
            {
              type: 'array',
              item: {
                type: 'custom',
                name: 'VariantOption',
                href: '../VariantOption/',
                generics: [
                  {
                    type: 'custom',
                    name: 'TKey',
                  },
                ],
              },
            },
            {
              type: 'array',
              item: {
                type: 'custom',
                name: 'VariantOptionAsync',
                href: '../VariantOptionAsync/',
                generics: [
                  {
                    type: 'custom',
                    name: 'TKey',
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
