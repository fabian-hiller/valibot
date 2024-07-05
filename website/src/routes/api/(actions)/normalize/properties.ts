import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TForm: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'NormalizeForm',
          href: '../NormalizeForm/',
        },
        'undefined',
      ],
    },
  },
  form: {
    type: {
      type: 'custom',
      name: 'TForm',
    },
  },
  Action: {
    type: {
      type: 'custom',
      name: 'NormalizeAction',
      href: '../NormalizeAction/',
    },
  },
};
