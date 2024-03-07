import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchemaAsync',
      href: '../BaseSchemaAsync/',
    },
  },
  FallbackAsync: {
    modifier: 'extends',
    type: {
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
              type: {
                type: 'custom',
                name: 'FallbackInfo',
                href: '../FallbackInfo/',
              },
              name: 'info',
              optional: true,
            },
          ],
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
            ],
          },
        },
      ],
    },
  },
};
