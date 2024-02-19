import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'SchemaWithMaybeDefault',
          href: '../SchemaWithMaybeDefault/',
        },
        {
          type: 'custom',
          name: 'SchemaWithMaybeDefaultAsync',
          href: '../SchemaWithMaybeDefaultAsync/',
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
            name: 'TSchema',
            indexes: [
              {
                type: 'string',
                value: 'default',
              },
            ],
          },
          extends: {
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
          true: {
            type: 'custom',
            name: 'TSchema',
            indexes: [
              {
                type: 'string',
                value: 'default',
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
                value: 'default',
              },
            ],
          },
          extends: {
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
                    value: 'default',
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
                value: 'default',
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
                        value: 'default',
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
