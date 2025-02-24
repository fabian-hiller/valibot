import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ObjectInput',
      href: '../ObjectInput/',
    },
  },
  TRequirement: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'TInput',
    },
  },
  selectedKeys: {
    type: {
      type: 'custom',
      name: 'TSelectedKeys',
    },
  },
  Action: {
    type: {
      type: 'custom',
      name: 'ToMinValueAction',
      href: '../ToMinValueAction/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'TRequirement',
        },
      ],
    },
  },
};
