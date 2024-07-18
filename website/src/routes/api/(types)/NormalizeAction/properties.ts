import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TForm: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'NormalizeForm',
      href: '../NormalizeForm/',
    },
  },
  BaseTransformation: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseTransformation',
      href: '../BaseTransformation/',
      generics: ['string', 'string', 'never'],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'normalize',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'normalize',
      href: '../normalize/',
    },
  },
  form: {
    type: {
      type: 'custom',
      name: 'TForm',
    },
  },
};
