import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  SchemaIssue: {
    type: {
      type: 'custom',
      name: 'Omit',
      generics: [
        {
          type: 'custom',
          name: 'SchemaConfig',
          href: '../SchemaConfig/',
        },
        {
          type: 'string',
          value: 'message',
        },
      ],
    },
  },
  reason: {
    type: {
      type: 'custom',
      name: 'IssueReason',
      href: '../IssueReason/',
    },
  },
  context: {
    type: 'string',
  },
  input: {
    type: 'unknown',
  },
  expected: {
    type: {
      type: 'union',
      options: ['string', 'null'],
    },
  },
  received: {
    type: 'string',
  },
  message: {
    type: 'string',
  },
  requirement: {
    type: {
      type: 'union',
      options: ['unknown', 'undefined'],
    },
  },
  path: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'IssuePath',
          href: '../IssuePath/',
        },
        'undefined',
      ],
    },
  },
  issues: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'SchemaIssues',
          href: '../SchemaIssues/',
        },
        'undefined',
      ],
    },
  },
};
