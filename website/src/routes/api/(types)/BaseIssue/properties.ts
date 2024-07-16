import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  Config: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'Config',
      href: '../Config/',
      generics: [
        {
          type: 'custom',
          name: 'BaseIssue',
          href: '../BaseIssue/',
          generics: [
            {
              type: 'custom',
              name: 'TInput',
            },
          ],
        },
      ],
    },
  },
  kind: {
    type: {
      type: 'union',
      options: [
        {
          type: 'string',
          value: 'schema',
        },
        {
          type: 'string',
          value: 'validation',
        },
        {
          type: 'string',
          value: 'transformation',
        },
      ],
    },
  },
  type: {
    type: 'string',
  },
  input: {
    type: {
      type: 'custom',
      name: 'TInput',
    },
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
          type: 'tuple',
          items: [
            {
              type: 'custom',
              name: 'IssuePathItem',
              href: '../IssuePathItem/',
            },
            {
              type: 'array',
              spread: true,
              item: {
                type: 'custom',
                name: 'IssuePathItem',
                href: '../IssuePathItem/',
              },
            },
          ],
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
          type: 'tuple',
          items: [
            {
              type: 'custom',
              name: 'BaseIssue',
              href: '../BaseIssue/',
              generics: [
                {
                  type: 'custom',
                  name: 'TInput',
                },
              ],
            },
            {
              type: 'array',
              spread: true,
              item: {
                type: 'custom',
                name: 'BaseIssue',
                href: '../BaseIssue/',
                generics: [
                  {
                    type: 'custom',
                    name: 'TInput',
                  },
                ],
              },
            },
          ],
        },
        'undefined',
      ],
    },
  },
};
