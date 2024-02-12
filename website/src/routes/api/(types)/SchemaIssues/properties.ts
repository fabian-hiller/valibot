import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  SchemaIssues: {
    type: {
      type: 'tuple',
      items: [
        {
          type: 'custom',
          name: 'SchemaIssue',
          href: '../SchemaIssue/',
        },
        {
          type: 'array',
          spread: true,
          item: {
            type: 'custom',
            name: 'SchemaIssue',
            href: '../SchemaIssue/',
          },
        },
      ],
    },
  },
};
