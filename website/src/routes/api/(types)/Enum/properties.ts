import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  Enum: {
    type: {
      type: 'object',
      entries: [
        {
          key: { name: 'key', type: 'string' },
          value: ['string', 'number'],
        },
        {
          key: { name: 'key', type: 'number' },
          value: 'string',
        },
      ],
    },
  },
};
