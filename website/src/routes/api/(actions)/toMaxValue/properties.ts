import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ValueInput',
      href: '../ValueInput/',
    },
  },
  TRequirement: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'TInput',
    },
  },
  requirement: {
    type: {
      type: 'custom',
      name: 'TRequirement',
    },
  },
  Action: {
    type: {
      type: 'custom',
      name: 'ToMaxValueAction',
      href: '../ToMaxValueAction/',
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
