import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TValue: {
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
  typed: {
    type: {
      type: 'boolean',
      value: true,
    },
  },
  value: {
    type: {
      type: 'custom',
      name: 'TValue',
    },
  },
  issues: {
    type: {
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
  },
};
