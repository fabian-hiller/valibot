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
  TFallback: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'FallbackAsync',
      href: '../FallbackAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
      ],
    },
  },
  ModifiedBaseSchemaOrAsync: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'Omit',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
        {
          type: 'union',
          options: [
            {
              type: 'string',
              value: 'async',
            },
            {
              type: 'string',
              value: '~run',
            },
          ],
        },
      ],
    },
  },
  fallback: {
    type: {
      type: 'custom',
      name: 'TFallback',
    },
  },
  async: {
    type: {
      type: 'boolean',
      value: true,
    },
  },
  '~run': {
    type: {
      type: 'function',
      params: [
        {
          name: 'dataset',
          type: {
            type: 'custom',
            name: 'UnknownDataset',
            href: '../UnknownDataset/',
          },
        },
        {
          name: 'config',
          type: {
            type: 'custom',
            name: 'Config',
            href: '../Config/',
            generics: [
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
      return: {
        type: 'custom',
        name: 'Promise',
        generics: [
          {
            type: 'custom',
            name: 'OutputDataset',
            href: '../OutputDataset/',
            generics: [
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
            ],
          },
        ],
      },
    },
  },
};
