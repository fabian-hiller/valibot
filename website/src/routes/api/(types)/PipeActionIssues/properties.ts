import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  PipeActionIssues: {
    type: {
      type: 'tuple',
      items: [
        {
          type: 'custom',
          name: 'PipeActionIssue',
          href: '../PipeActionIssue/',
        },
        {
          type: 'array',
          spread: true,
          item: {
            type: 'custom',
            name: 'PipeActionIssue',
            href: '../PipeActionIssue/',
          },
        },
      ],
    },
  },
};
