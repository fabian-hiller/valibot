import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  ObjectEntries: {
    type: {
      type: 'object',
      entries: [
        {
          key: {
            name: 'key',
            type: 'string',
          },
          value: {
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
