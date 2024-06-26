import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TWrapped: {
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
  TInput: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: ['null', 'undefined'],
    },
  },
  DefaultAsync: {
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
              name: 'InferInput',
              href: '../InferInput/',
              generics: [
                {
                  type: 'custom',
                  name: 'TWrapped',
                },
              ],
            },
            {
              type: 'custom',
              name: 'TInput',
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
                name: 'Dataset',
                href: '../Dataset/',
                generics: [
                  {
                    type: 'custom',
                    name: 'TInput',
                  },
                  'never',
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
                        name: 'TWrapped',
                      },
                    ],
                  },
                ],
              },
            },
          ],
          return: {
            type: 'custom',
            name: 'MaybePromise',
            href: '../MaybePromise/',
            generics: [
              {
                type: 'custom',
                name: 'MaybeReadonly',
                href: '../MaybeReadonly/',
                generics: [
                  {
                    type: 'custom',
                    name: 'InferInput',
                    href: '../InferInput/',
                    generics: [
                      {
                        type: 'custom',
                        name: 'TWrapped',
                      },
                    ],
                  },
                  {
                    type: 'custom',
                    name: 'TInput',
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
