import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  VariantOptions: {
    type: {
      type: 'tuple',
      items: [
        {
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
        {
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
        {
          type: 'array',
          spread: true,
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
      ],
    },
  },
};
