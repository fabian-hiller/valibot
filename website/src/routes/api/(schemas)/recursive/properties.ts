import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TGetter: {
    modifier: 'extends',
    type: {
      type: 'function',
      params: [],
      return: {
        type: 'custom',
        name: 'BaseSchema',
        href: '../../types/index/',
      },
    },
  },
  getter: {
    type: {
      type: 'custom',
      name: 'TGetter',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'RecursiveSchema',
      href: '../RecursiveSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TGetter',
        },
      ],
    },
  },
};
