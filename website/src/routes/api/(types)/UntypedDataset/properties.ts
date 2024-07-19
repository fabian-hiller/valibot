import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TIssue: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseIssue',
      href: '../BaseIssue/',
      generics: ['unknown'],
    },
  },
  typed: {
    type: {
      type: 'boolean',
      value: false,
    },
  },
  value: {
    type: 'unknown',
  },
  issues: {
    type: {
      type: 'union',
      options: [
        {
          type: 'tuple',
          items: [
            {
              type: 'custom',
              name: 'TIssue',
            },
            {
              type: 'array',
              spread: true,
              item: {
                type: 'custom',
                name: 'TIssue',
              },
            },
          ],
        },
        'undefined',
      ],
    },
  },
};
