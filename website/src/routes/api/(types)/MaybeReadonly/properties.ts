import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  MaybeReadonly: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Readonly',
          generics: [
            {
              type: 'custom',
              name: 'T',
            },
          ],
        },
        {
          type: 'custom',
          name: 'T',
        },
      ],
    },
  },
};
