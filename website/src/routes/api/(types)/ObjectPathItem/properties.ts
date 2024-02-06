import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  type: {
    type: {
      type: 'string',
      value: 'object',
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
      type: 'custom',
      name: 'Record',
      generics: ['string', 'unknown'],
    },
  },
};
