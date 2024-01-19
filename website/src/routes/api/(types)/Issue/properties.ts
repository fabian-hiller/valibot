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
    type: {
      type: 'union',
      options: [
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
  },
  issues: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Issues',
          href: '../Issues/',
        },
        'undefined',
      ],
    },
  },
  abortEarly: {
    type: {
      type: 'union',
      options: ['boolean', 'undefined'],
    },
  },
  abortPipeEarly: {
    type: {
      type: 'union',
      options: ['boolean', 'undefined'],
    },
  },
  skipPipe: {
    type: {
      type: 'union',
      options: ['boolean', 'undefined'],
    },
  },
};
