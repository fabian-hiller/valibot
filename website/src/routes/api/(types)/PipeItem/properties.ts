import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
  },
  TIssue: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseIssue',
      href: '../BaseIssue/',
      generics: ['unknown'],
    },
  },
  PipeItem: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'BaseSchema',
          href: '../BaseSchema/',
          generics: [
            {
              type: 'custom',
              name: 'TInput',
            },
            {
              type: 'custom',
              name: 'TOutput',
            },
            {
              type: 'custom',
              name: 'TIssue',
            },
          ],
        },
        {
          type: 'custom',
          name: 'PipeAction',
          href: '../PipeAction/',
          generics: [
            {
              type: 'custom',
              name: 'TInput',
            },
            {
              type: 'custom',
              name: 'TOutput',
            },
            {
              type: 'custom',
              name: 'TIssue',
            },
          ],
        },
      ],
    },
  },
};
