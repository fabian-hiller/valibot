import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TTuple: {
    modifier: 'extends',
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
  FirstTupleItem: {
    type: {
      type: 'custom',
      name: 'TTuple',
      indexes: [
        {
          type: 'number',
          value: 0,
        },
      ],
    },
  },
};
