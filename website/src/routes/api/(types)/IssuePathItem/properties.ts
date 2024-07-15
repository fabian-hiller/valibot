import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  IssuePathItem: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ArrayIssuePathItem',
          href: '../ArrayIssuePathItem/',
        },
        {
          type: 'custom',
          name: 'MapIssuePathItem',
          href: '../MapIssuePathItem/',
        },
        {
          type: 'custom',
          name: 'ObjectIssuePathItem',
          href: '../ObjectIssuePathItem/',
        },
        {
          type: 'custom',
          name: 'SetIssuePathItem',
          href: '../SetIssuePathItem/',
        },
        {
          type: 'custom',
          name: 'UnknownIssuePathItem',
          href: '../UnknownIssuePathItem/',
        },
      ],
    },
  },
};
