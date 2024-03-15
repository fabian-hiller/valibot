import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  ErrorMessage: {
    type: {
      type: 'union',
      options: [
        'string',
        {
          type: 'function',
          params: [],
          return: 'string',
        },
      ],
    },
  },
};
