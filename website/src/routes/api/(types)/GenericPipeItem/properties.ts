import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
    default: 'any',
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
    default: {
      type: 'custom',
      name: 'TInput',
    },
  },
  TIssue: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseIssue',
      href: '../BaseIssue/',
      generics: ['unknown'],
    },
    default: {
      type: 'custom',
      name: 'BaseIssue',
      generics: ['unknown'],
    },
  },
  PipeItem: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'PipeItem',
      href: '../PipeItem/',
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
  },
};
