import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        'unknown',
        'unknown',
        {
          type: 'custom',
          name: 'BaseIssue',
          href: '../BaseIssue/',
          generics: ['unknown'],
        },
      ],
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
  },
  BaseSchema: {
    modifier: 'extends',
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
