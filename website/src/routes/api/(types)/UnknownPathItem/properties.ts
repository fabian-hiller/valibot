import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  type: {
    type: {
      type: 'string',
      value: 'unknown',
    },
  },
  origin: {
    type: {
      type: 'union',
      options: [
        {
          type: 'string',
          value: 'key',
        },
        {
          type: 'string',
          value: 'value',
        },
      ],
    },
  },
};
