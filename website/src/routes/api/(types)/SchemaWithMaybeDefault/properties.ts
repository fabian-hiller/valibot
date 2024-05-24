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
    default: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
    },
  },
  SchemaWithMaybeDefault: {
    type: {
      type: 'intersect',
      options: [
        {
          type: 'custom',
          name: 'TSchema',
        },
        {
          type: 'object',
          entries: [
            {
              key: 'default',
              optional: true,
              value: {
                type: 'union',
                options: [
                  {
                    type: 'custom',
                    name: 'Output',
                    href: '../Output/',
                    generics: [
                      {
                        type: 'custom',
                        name: 'TSchema',
                      },
                    ],
                  },
                  {
                    type: 'function',
                    params: [],
                    return: {
                      type: 'union',
                      options: [
                        {
                          type: 'custom',
                          name: 'Output',
                          href: '../Output/',
                          generics: [
                            {
                              type: 'custom',
                              name: 'TSchema',
                            },
                          ],
                        },
                        'undefined',
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  },
};
