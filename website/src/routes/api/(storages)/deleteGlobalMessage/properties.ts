import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  lang: {
    type: {
      type: 'union',
      options: ['string', 'undefined'],
    },
  },
};
