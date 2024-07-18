import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TKey: {
    modifier: 'extends',
    type: 'string',
  },
  VariantOptions: {
    type: {
      type: 'custom',
      name: 'MaybeReadonly',
      href: '../MaybeReadonly/',
      generics: [
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
      ],
    },
  },
};
