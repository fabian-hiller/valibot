import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  ContentInput: {
    type: {
      type: 'union',
      options: [
        'string',
        {
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
      ],
    },
  },
};
