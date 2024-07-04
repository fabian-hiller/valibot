import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  reference: {
    type: {
      type: 'custom',
      name: 'Reference',
      href: '../Reference/',
    },
  },
  lang: {
    type: {
      type: 'union',
      options: ['string', 'undefined'],
    },
  },
  message: {
    type: {
      type: 'union',
      options: [
        {
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
        'undefined',
      ],
    },
  },
};
