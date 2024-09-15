import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TTitle: {
    modifier: 'extends',
    type: 'string',
  },
  title_: {
    type: {
      type: 'custom',
      name: 'TTitle',
    },
  },
  Action: {
    type: {
      type: 'custom',
      name: 'TitleAction',
      href: '../TitleAction/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'TTitle',
        },
      ],
    },
  },
};
