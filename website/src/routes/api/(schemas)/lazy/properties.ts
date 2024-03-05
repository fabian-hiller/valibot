import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TGetter: {
    modifier: 'extends',
    type: {
      type: 'function',
      params: [{ name: 'input', type: 'unknown' }],
      return: {
        type: 'custom',
        name: 'BaseSchema',
        href: '../BaseSchema/',
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
      name: 'LazySchema',
      href: '../LazySchema/',
      generics: [
        {
          type: 'custom',
          name: 'TGetter',
        },
      ],
    },
  },
};
