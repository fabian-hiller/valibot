import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  type: {
    type: {
      type: 'string',
      value: 'tuple',
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
