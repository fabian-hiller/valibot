import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BrandName: {
    type: {
      type: 'union',
      options: ['string', 'number', 'symbol'],
    },
  },
};
