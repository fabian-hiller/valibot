import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  PicklistOptions: {
    type: [
      {
        type: 'custom',
        name: 'MaybeReadonly',
        href: '../MaybeReadonly/',
        generics: [
          {
            type: 'array',
            item: 'string',
          },
        ],
      },
    ],
  },
};
