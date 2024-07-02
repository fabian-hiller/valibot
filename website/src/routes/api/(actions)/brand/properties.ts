import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TName: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BrandName',
      href: '../BrandName/',
    },
  },
  name: {
    type: {
      type: 'custom',
      name: 'TName',
    },
  },
  Action: {
    type: {
      type: 'custom',
      name: 'BicAction',
      href: '../BicAction/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'TName',
        },
      ],
    },
  },
};
