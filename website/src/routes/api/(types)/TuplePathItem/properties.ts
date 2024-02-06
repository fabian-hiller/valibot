import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  type: {
    type: {
      type: 'string',
      value: 'tuple',
    },
  },
  origin: {
    type: {
      type: 'string',
      value: 'value',
    },
  },
  input: {
    type: {
      type: 'tuple',
      items: [
        'unknown',
        {
          type: 'array',
          spread: true,
          item: 'unknown',
        },
      ],
    },
  },
};
