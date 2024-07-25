import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  ArrayInput: {
    type: {
      type: 'custom',
      name: 'MaybeReadonly',
      href: '../MaybeReadonly/',
      generics: [
        {
          type: 'array',
          item: 'unknown',
        },
      ],
    },
  },
};
