import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  Literal: {
    type: {
      type: 'union',
      options: ['bigint', 'boolean', 'number', 'string', 'symbol'],
    },
  },
};
