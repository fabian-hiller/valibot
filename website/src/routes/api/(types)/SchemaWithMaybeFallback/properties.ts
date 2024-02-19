import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
    },
    default: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
    },
  },
  SchemaWithMaybeFallback: {
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
              key: 'fallback',
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
                    params: [
                      {
                        name: 'info',
                        optional: true,
                        type: {
                          type: 'custom',
                          name: 'FallbackInfo',
                          href: '../FallbackInfo/',
                        },
                      },
                    ],
                    return: {
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
