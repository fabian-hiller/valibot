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
      type: 'custom',
      name: 'Fallback',
      href: '../Fallback/',
    },
  },
  schema: {
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
  Schema: {
    type: {
      type: 'custom',
      name: 'SchemaWithFallback',
      href: '../SchemaWithFallback/',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
        {
          type: 'custom',
          name: 'TFallback',
        },
      ],
    },
  },
};
