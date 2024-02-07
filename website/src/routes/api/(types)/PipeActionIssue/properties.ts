import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  context: {
    type: {
      type: 'custom',
      name: 'PipeActionContext',
      href: '../PipeActionContext/',
    },
  },
  received: {
    type: {
      type: 'union',
      options: ['string', 'undefined'],
    },
  },
  path: {
    type: {
      type: 'custom',
      name: 'IssuePath',
      href: '../IssuePath/',
    },
  },
};
