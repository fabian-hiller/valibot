import type { PropertyProps } from '~/components';

const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  Action: {
    type: {
      type: 'custom',
      name: 'ToBooleanAction',
      href: '../ToBooleanAction/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
};

export default properties;
