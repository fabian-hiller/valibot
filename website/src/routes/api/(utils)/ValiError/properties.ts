import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
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
        {
          type: 'custom',
          name: 'BaseSchemaAsync',
          href: '../BaseSchemaAsync/',
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
      ],
    },
  },
  issues: {
    type: {
      type: 'tuple',
      items: [
        {
          type: 'custom',
          name: 'InferIssue',
          generics: [
            {
              type: 'custom',
              name: 'TSchema',
            },
          ],
        },
        {
          type: 'array',
          spread: true,
          item: {
            type: 'custom',
            name: 'InferIssue',
            generics: [
              {
                type: 'custom',
                name: 'TSchema',
              },
            ],
          },
        },
      ],
    },
  },
  error: {
    type: {
      type: 'custom',
      name: 'ValiError',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
      ],
    },
  },
};
