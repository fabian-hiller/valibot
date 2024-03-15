import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  UnionOptions: {
    type: {
      type: 'custom',
      name: 'MaybeReadonly',
      href: '../MaybeReadonly/',
      generics: [
        {
          type: 'array',
          item: {
            type: 'custom',
            name: 'BaseSchema',
            href: '../BaseSchema/',
          },
        },
      ],
    },
  },
};
