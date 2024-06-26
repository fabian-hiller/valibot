import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  Class: {
    modifier: 'new',
    type: {
      type: 'function',
      params: [
        {
          spread: true,
          name: 'args',
          type: {
            type: 'array',
            item: 'any',
          },
        },
      ],
      return: 'any',
    },
  },
};
