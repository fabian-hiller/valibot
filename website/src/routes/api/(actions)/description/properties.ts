import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TDescription: {
    modifier: 'extends',
    type: 'string',
  },
  description_: {
    type: {
      type: 'custom',
      name: 'TDescription',
    },
  },
  Action: {
    type: {
      type: 'custom',
      name: 'DescriptionAction',
      href: '../DescriptionAction/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'TDescription',
        },
      ],
    },
  },
};
