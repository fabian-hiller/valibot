import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  typed: {
    type: {
      type: 'boolean',
      value: false,
    },
  },
  issues: {
    type: {
      type: 'custom',
      name: 'Issues',
      href: '../Issues/',
    },
  },
};
