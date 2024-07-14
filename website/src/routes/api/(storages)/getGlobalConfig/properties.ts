import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TIssue: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseIssue',
      href: '../types/',
      generics: ['unknown'],
    },
  },
  merge: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Config',
          href: '../Config/',
          generics: [
            {
              type: 'custom',
              name: 'TIssue',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  config: {
    type: {
      type: 'custom',
      name: 'Config',
      href: '../Config/',
      generics: [
        {
          type: 'custom',
          name: 'TIssue',
        },
      ],
    },
  },
};
