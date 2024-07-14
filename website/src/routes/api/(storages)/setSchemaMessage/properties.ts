import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  message: {
    type: {
      type: 'custom',
      name: 'ErrorMessage',
      href: '../ErrorMessage/',
      generics: [
        {
          type: 'custom',
          name: 'BaseIssue',
          href: '../BaseIssue/',
          generics: ['unknown'],
        },
      ],
    },
  },
  lang: {
    type: {
      type: 'union',
      options: ['string', 'undefined'],
    },
  },
};
