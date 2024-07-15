import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: ['unknown', 'unknown', 'never'],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'unknown',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'unknown',
      href: '../unknown/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'unknown',
    },
  },
};
