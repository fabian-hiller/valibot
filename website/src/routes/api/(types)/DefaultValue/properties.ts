import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TDefault: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Default',
          href: '../Default/',
          generics: [
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
              type: 'union',
              options: ['null', 'undefined'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'DefaultAsync',
          href: '../DefaultAsync/',
          generics: [
            {
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
            {
              type: 'union',
              options: ['null', 'undefined'],
            },
          ],
        },
      ],
    },
  },
  DefaultValue: {
    type: {
      type: 'conditional',
      conditions: [
        {
          type: {
            type: 'custom',
            name: 'TDefault',
          },
          extends: {
            type: 'custom',
            name: 'DefaultAsync',
            href: '../DefaultAsync/',
            generics: [
              {
                type: 'custom',
                modifier: 'infer',
                name: 'TWrapped',
              },
              {
                type: 'custom',
                modifier: 'infer',
                name: 'TInput',
              },
            ],
          },
          true: {
            type: 'conditional',
            conditions: [
              {
                type: {
                  type: 'custom',
                  name: 'TDefault',
                },
                extends: {
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
                true: {
                  type: 'custom',
                  name: 'Awaited',
                  generics: [
                    {
                      type: 'custom',
                      name: 'ReturnType',
                      generics: [
                        {
                          type: 'custom',
                          name: 'TDefault',
                        },
                      ],
                    },
                  ],
                },
              },
            ],
            false: {
              type: 'custom',
              name: 'TDefault',
            },
          },
        },
      ],
      false: 'never',
    },
  },
};
