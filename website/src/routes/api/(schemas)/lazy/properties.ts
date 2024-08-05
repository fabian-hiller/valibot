import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TWrapped: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        'unknown',
        'unknown',
        {
          type: 'custom',
          name: 'BaseIssue',
          href: '../BaseIssue/',
          generics: ['unknown'],
        },
      ],
    },
  },
  getter: {
    type: {
      type: 'function',
      params: [{ name: 'input', type: 'unknown' }],
      return: {
        type: 'custom',
        name: 'TWrapped',
      },
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
          name: 'TWrapped',
        },
      ],
    },
  },
};
