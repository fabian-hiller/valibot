import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  VariantOption: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ObjectSchema',
          href: '../ObjectSchema/',
          generics: [
            {
              type: 'custom',
              name: 'Record',
              generics: [
                {
                  type: 'custom',
                  name: 'TKey',
                },
                {
                  type: 'custom',
                  name: 'BaseSchema',
                  href: '../BaseSchema/',
                },
              ],
            },
            'any',
          ],
        },
        {
          type: 'custom',
          name: 'VariantSchema',
          href: '../VariantSchema/',
          generics: [
            {
              type: 'custom',
              name: 'TKey',
            },
          ],
        },
      ],
    },
  },
};
