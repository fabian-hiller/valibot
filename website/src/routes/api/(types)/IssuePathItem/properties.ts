import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  IssuePathItem: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ArrayPathItem',
          href: '../ArrayPathItem/',
        },
        {
          type: 'custom',
          name: 'MapPathItem',
          href: '../MapPathItem/',
        },
        {
          type: 'custom',
          name: 'ObjectPathItem',
          href: '../ObjectPathItem/',
        },
        {
          type: 'custom',
          name: 'SetPathItem',
          href: '../SetPathItem/',
        },
        {
          type: 'custom',
          name: 'UnknownPathItem',
          href: '../UnknownPathItem/',
        },
      ],
    },
  },
};
