import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'SchemaWithMaybeFallback',
      href: '../SchemaWithMaybeFallback/',
    },
  },
  schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
  info: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'FallbackInfo',
          href: '../FallbackInfo/',
        },
        'undefined',
      ],
    },
  },
  value: {
    type: {
      type: 'custom',
      name: 'FallbackValue',
      href: '../FallbackValue/',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
      ],
    },
  },
};
