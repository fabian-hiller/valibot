import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  reason: {
    type: {
      type: 'custom',
      name: 'IssueReason',
      href: '../IssueReason/',
    },
  },
  origin: {
    type: {
      type: 'custom',
      name: 'IssueOrigin',
      href: '../IssueOrigin/',
    },
  },
  path: {
    type: [
      {
        type: 'array',
        item: {
          type: 'custom',
          name: 'PathItem',
          href: '../PathItem/',
        },
      },
      'undefined',
    ],
  },
  issues: {
    type: [
      {
        type: 'custom',
        name: 'Issues',
        href: '../Issues/',
      },
      'undefined',
    ],
  },
  abortEarly: {
    type: ['boolean', 'undefined'],
  },
  abortPipeEarly: {
    type: ['boolean', 'undefined'],
  },
  skipPipe: {
    type: ['boolean', 'undefined'],
  },
};
