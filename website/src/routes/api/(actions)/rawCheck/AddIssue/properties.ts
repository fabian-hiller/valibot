import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  AddIssue: {
    type: {
      type: 'function',
      params: [
        {
          name: 'info',
          optional: true,
          type: {
            type: 'custom',
            name: 'IssueInfo',
            href: '../IssueInfo/',
            generics: [
              {
                type: 'custom',
                name: 'TInput',
              },
            ],
          },
        },
      ],
      return: 'void',
    },
  },
};
