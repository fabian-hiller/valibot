import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  reference: {
    type: {
      type: 'custom',
      name: 'Reference',
      href: '../Reference/',
    },
  },
  lang: {
    type: {
      type: 'union',
      options: ['string', 'undefined'],
    },
  },
};
