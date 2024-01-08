import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  ResolveObject: {
    type: {
      type: 'object',
      entries: [
        {
          key: {
            name: 'k',
            type: {
              type: 'custom',
              name: 'T',
              modifier: 'keyof',
            },
          },
          value: {
            type: 'custom',
            name: 'T',
            indexes: [
              {
                type: 'custom',
                name: 'k',
              },
            ],
          },
        },
      ],
    },
  },
};
