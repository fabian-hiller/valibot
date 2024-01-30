import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  IntersectOptions: {
    type: {
      type: 'custom',
      name: 'MaybeReadonly',
      href: '../MaybeReadonly/',
      generics: [
        {
          type: 'tuple',
          items: [
            {
              type: 'custom',
              name: 'BaseSchema',
              href: '../BaseSchema/',
            },
            {
              type: 'custom',
              name: 'BaseSchema',
              href: '../BaseSchema/',
            },
            {
              type: 'array',
              spread: true,
              item: {
                type: 'custom',
                name: 'BaseSchema',
                href: '../BaseSchema/',
              },
            },
          ],
        },
      ],
    },
  },
};
