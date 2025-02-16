import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
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
  Fallback: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'MaybeReadonly',
          href: '../MaybeReadonly/',
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
          ],
        },
        {
          type: 'function',
          params: [
            {
              name: 'dataset',
              optional: true,
              type: {
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
            },
            {
              name: 'config',
              optional: true,
              type: {
                type: 'custom',
                name: 'Config',
                href: '../Config/',
                generics: [
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
            },
          ],
          return: {
            type: 'custom',
            name: 'MaybeReadonly',
            href: '../MaybeReadonly/',
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
            ],
          },
        },
      ],
    },
  },
};
