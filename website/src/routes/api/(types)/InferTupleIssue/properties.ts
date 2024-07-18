import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TItems: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'TupleItems',
          href: '../TupleItems/',
        },
        {
          type: 'custom',
          name: 'TupleItemsAsync',
          href: '../TupleItemsAsync/',
        },
      ],
    },
  },
  InferTupleIssue: {
    type: {
      type: 'custom',
      name: 'InferIssue',
      href: '../InferIssue/',
      generics: [
        {
          type: 'custom',
          name: 'TItems',
          indexes: ['number'],
        },
      ],
    },
  },
};
