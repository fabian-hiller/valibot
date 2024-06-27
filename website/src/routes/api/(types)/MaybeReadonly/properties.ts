import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TValue: {
    modifier: 'extends',
    type: 'any',
  },
  MaybeReadonly: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'TValue',
        },
        {
          type: 'custom',
          name: 'Readonly',
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
