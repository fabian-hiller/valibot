import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  type: {
    type: {
      type: 'string',
      value: 'record',
    },
  },
  input: {
    type: {
      type: 'custom',
      name: 'Record',
      generics: [['string', 'number', 'symbol'], 'unknown'],
    },
  },
  key: {
    type: ['string', 'number', 'symbol'],
  },
};
