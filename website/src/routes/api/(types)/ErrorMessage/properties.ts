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
  ErrorMessage: {
    type: {
      type: 'union',
      options: [
        {
          type: 'function',
          params: [
            {
              name: 'issue',
              type: {
                type: 'custom',
                name: 'TIssue',
              },
            },
          ],
          return: 'string',
        },
        'string',
      ],
    },
  },
};
