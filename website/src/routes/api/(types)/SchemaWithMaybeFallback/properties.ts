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
  TFallback: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'Fallback',
      href: '../Fallback/',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
      ],
    },
    default: {
      type: 'custom',
      name: 'Fallback',
      href: '../Fallback/',
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
