import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: ['any', 'any', 'never'],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'any',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'any',
      href: '../any/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'any',
    },
  },
};
