import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TValue: {
    modifier: 'extends',
    type: 'any',
  },
  MaybePromise: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'TValue',
        },
        {
          type: 'custom',
          name: 'Promise',
          generics: [
            {
              type: 'custom',
              name: 'TValue',
            },
          ],
        },
      ],
    },
  },
};
