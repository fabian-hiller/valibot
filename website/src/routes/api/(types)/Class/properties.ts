import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  Class: {
    type: [
      {
        type: 'function',
        modifier: 'abstract new',
        params: [
          {
            spread: true,
            name: 'args',
            type: 'any',
          },
        ],
        return: 'any',
      },
    ],
  },
};
