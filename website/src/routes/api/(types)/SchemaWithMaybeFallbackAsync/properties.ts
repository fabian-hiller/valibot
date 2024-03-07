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
  TFallback: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'FallbackAsync',
      href: '../FallbackAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
      ],
    },
    default: {
      type: 'custom',
      name: 'FallbackAsync',
      href: '../FallbackAsync/',
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
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'TFallback',
        },
        'undefined',
      ],
    },
  },
};
