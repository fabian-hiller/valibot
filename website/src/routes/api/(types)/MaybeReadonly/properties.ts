import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  T: {
    modifier: 'extends',
    type: 'any',
  },
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
