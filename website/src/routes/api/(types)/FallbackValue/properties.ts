import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'SchemaWithMaybeFallback',
          href: '../SchemaWithMaybeFallback/',
        },
        {
          type: 'custom',
          name: 'SchemaWithMaybeFallbackAsync',
          href: '../SchemaWithMaybeFallbackAsync/',
        },
      ],
    },
  },
  FallbackValue: {
    type: {
      type: 'conditional',
      conditions: [
        {
          type: {
            type: 'custom',
            name: 'TSchema',
            indexes: [
              {
                type: 'string',
                value: 'fallback',
              },
            ],
          },
          extends: {
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
          true: {
            type: 'custom',
            name: 'TSchema',
            indexes: [
              {
                type: 'string',
                value: 'fallback',
              },
            ],
          },
        },
        {
          type: {
            type: 'custom',
            name: 'TSchema',
            indexes: [
              {
                type: 'string',
                value: 'fallback',
              },
            ],
          },
          extends: {
            type: 'function',
            params: [],
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
          true: {
            type: 'custom',
            name: 'ReturnType',
            generics: [
              {
                type: 'custom',
                name: 'TSchema',
                indexes: [
                  {
                    type: 'string',
                    value: 'fallback',
                  },
                ],
              },
            ],
          },
        },
        {
          type: {
            type: 'custom',
            name: 'TSchema',
            indexes: [
              {
                type: 'string',
                value: 'fallback',
              },
            ],
          },
          extends: {
            type: 'function',
            params: [],
            return: {
              type: 'custom',
              name: 'Promise',
              generics: [
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
                    name: 'TSchema',
                    indexes: [
                      {
                        type: 'string',
                        value: 'fallback',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
      false: 'undefined',
    },
  },
};
