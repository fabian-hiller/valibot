import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  IntersectOptions: {
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
            generics: [
              'unknown',
              'unknown',
              {
                type: 'custom',
                name: 'BaseIssue',
                href: '../BaseIssue/',
                generics: ['unknown'],
              },
            ],
          },
        },
      ],
    },
  },
};
