import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  IssueOrigin: {
    type: {
      type: 'union',
      options: [
        {
          type: 'string',
          value: 'key',
        },
        {
          type: 'string',
          value: 'value',
        },
      ],
    },
  },
};
