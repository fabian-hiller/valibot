import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: [
      {
        type: 'custom',
        name: 'BaseSchema',
        href: '../BaseSchema/',
      },
    ],
  },
  fallback: {
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
};
