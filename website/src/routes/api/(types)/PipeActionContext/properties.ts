import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  expects: {
    type: {
      type: 'union',
      options: ['string', 'null'],
    },
  },
  message: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ErrorMessage',
          href: '../ErrorMessage/',
        },
        'undefined',
      ],
    },
  },
};
