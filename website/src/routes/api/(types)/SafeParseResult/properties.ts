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
  SafeParseResult: {
    type: 'object',
  },
  typed: {
    type: 'boolean',
  },
  success: {
    type: 'boolean',
  },
  output: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'InferOutput',
          href: '../InferOutput/',
          generics: [
            {
              type: 'custom',
              name: 'TSchema',
            },
          ],
        },
        'unknown',
      ],
    },
  },
  issues: {
    type: {
      type: 'union',
      options: [
        {
          type: 'tuple',
          items: [
            {
              type: 'custom',
              name: 'InferIssue',
              href: '../InferIssue/',
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
                href: '../InferIssue/',
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
        'undefined',
      ],
    },
  },
};
