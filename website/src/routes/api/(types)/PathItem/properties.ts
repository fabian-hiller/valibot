import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  PathItem: {
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
          name: 'RecordPathItem',
          href: '../RecordPathItem/',
        },
        {
          type: 'custom',
          name: 'SetPathItem',
          href: '../SetPathItem/',
        },
        {
          type: 'custom',
          name: 'TuplePathItem',
          href: '../TuplePathItem/',
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
