import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  type: {
    type: {
      type: 'string',
      value: 'array',
    },
  },
  input: {
    type: {
      type: 'array',
      item: 'unknown',
    },
  },
};
