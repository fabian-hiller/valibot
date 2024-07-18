import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  ContentInput: {
    type: {
      type: 'union',
      options: [
        'string',
        {
          type: 'array',
          item: 'unknown',
        },
      ],
    },
  },
};
