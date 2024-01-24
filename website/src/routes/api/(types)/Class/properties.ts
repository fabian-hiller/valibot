import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  Class: {
    modifier: 'abstract new',
    type: {
      type: 'function',
      params: [
        {
          spread: true,
          name: 'args',
          type: 'any',
        },
      ],
      return: 'any',
    },
  },
};
