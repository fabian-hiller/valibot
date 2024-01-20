import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  Literal: {
    type: {
      type: 'union',
      options: ['number', 'string', 'boolean', 'symbol', 'bigint'],
    },
  },
};
