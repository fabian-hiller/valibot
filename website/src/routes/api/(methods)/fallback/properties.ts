import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
    },
  },
  TFallback: {
    type: [
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
        return: [
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
  schema: {
    type: [
      {
        type: 'custom',
        name: 'TSchema',
      },
    ],
  },
  fallback: {
    type: [
      {
        type: 'custom',
        name: 'TFallback',
      },
    ],
  },
  SchemaWithFallback: {
    type: [
      {
        type: 'custom',
        name: 'SchemaWithFallback',
        href: '../SchemaWithFallback/',
      },
    ],
  },
};
