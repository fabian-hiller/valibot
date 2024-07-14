import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ArrayInput',
      href: '../ArrayInput/',
    },
  },
  operation: {
    type: {
      type: 'custom',
      name: 'ArrayRequirement',
      href: '../ArrayRequirement/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
  Action: {
    type: {
      type: 'custom',
      name: 'FilterItemsAction',
      href: '../FilterItemsAction/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
};
