import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
    },
  },
  TFallback: {
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
              name: 'info',
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
    default: {
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
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
  fallback: {
    type: {
      type: 'custom',
      name: 'TFallback',
    },
  },
};
