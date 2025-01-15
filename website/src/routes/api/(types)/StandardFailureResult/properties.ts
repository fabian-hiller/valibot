import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  issues: {
    type: {
      type: 'array',
      modifier: 'readonly',
      item: {
        type: 'custom',
        name: 'StandardIssue',
        href: '../StandardIssue/',
      },
    },
  },
};
