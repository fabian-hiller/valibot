import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchemaAsync',
      href: '../BaseSchemaAsync/',
    },
    default: {
      type: 'custom',
      name: 'BaseSchemaAsync',
      href: '../BaseSchemaAsync/',
    },
  },
  SchemaWithMaybeDefaultAsync: {
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
                        {
                          type: 'custom',
                          name: 'Promise',
                          generics: [
                            {
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
