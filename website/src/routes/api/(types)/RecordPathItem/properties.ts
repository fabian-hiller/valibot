import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  type: {
    type: {
      type: 'string',
      value: 'record',
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
  input: {
    type: {
      type: 'custom',
      name: 'Record',
      generics: [
        {
          type: 'union',
          options: ['string', 'number', 'symbol'],
        },
        'unknown',
      ],
    },
  },
  key: {
    type: {
      type: 'union',
      options: ['string', 'number', 'symbol'],
    },
  },
};
