import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  ErrorMessage: {
    type: [
      'string',
      {
        type: 'function',
        params: [],
        return: 'string',
      },
    ],
  },
};
