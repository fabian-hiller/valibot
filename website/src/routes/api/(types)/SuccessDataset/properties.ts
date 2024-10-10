import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TValue: {
    modifier: 'extends',
    type: 'any',
  },
  typed: {
    type: {
      type: 'boolean',
      value: true,
    },
  },
  value: {
    type: {
      type: 'custom',
      name: 'TValue',
    },
  },
  issues: {
    type: 'undefined',
  },
};
