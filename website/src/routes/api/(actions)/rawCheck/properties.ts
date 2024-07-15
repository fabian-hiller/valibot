import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  action: {
    type: {
      type: 'function',
      params: [
        {
          name: 'context',
          type: {
            type: 'object',
            entries: [
              {
                key: 'dataset',
                value: {
                  type: 'custom',
                  name: 'Dataset',
                  href: '../Dataset/',
                  generics: [
                    {
                      type: 'custom',
                      name: 'TInput',
                    },
                    {
                      type: 'custom',
                      name: 'BaseIssue',
                      generics: ['unknown'],
                    },
                  ],
                },
              },
              {
                key: 'config',
                value: {
                  type: 'custom',
                  name: 'Config',
                  href: '../Config/',
                  generics: [
                    {
                      type: 'custom',
                      name: 'RawCheckIssue',
                      href: '../RawCheckIssue/',
                      generics: [
                        {
                          type: 'custom',
                          name: 'TInput',
                        },
                      ],
                    },
                  ],
                },
              },
              {
                key: 'addIssue',
                value: {
                  type: 'function',
                  params: [
                    {
                      name: 'info',
                      type: {
                        type: 'object',
                        entries: [
                          {
                            key: 'label',
                            optional: true,
                            value: 'string',
                          },
                          {
                            key: 'input',
                            optional: true,
                            value: 'unknown',
                          },
                          {
                            key: 'expected',
                            optional: true,
                            value: 'string',
                          },
                          {
                            key: 'received',
                            optional: true,
                            value: 'string',
                          },
                          {
                            key: 'message',
                            optional: true,
                            value: {
                              type: 'custom',
                              name: 'ErrorMessage',
                              href: '../ErrorMessage/',
                              generics: [
                                {
                                  type: 'custom',
                                  name: 'RawCheckIssue',
                                  href: '../RawCheckIssue/',
                                  generics: [
                                    {
                                      type: 'custom',
                                      name: 'TInput',
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: 'path',
                            optional: true,
                            value: {
                              type: 'tuple',
                              items: [
                                {
                                  type: 'custom',
                                  name: 'IssuePathItem',
                                  href: '../IssuePathItem/',
                                },
                                {
                                  type: 'array',
                                  spread: true,
                                  item: {
                                    type: 'custom',
                                    name: 'IssuePathItem',
                                    href: '../IssuePathItem/',
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                  return: 'void',
                },
              },
            ],
          },
        },
      ],
      return: 'void',
    },
  },
  Action: {
    type: {
      type: 'custom',
      name: 'RawCheckAction',
      href: '../RawCheckAction/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
};
