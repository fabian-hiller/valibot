import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TOutput: {
    modifier: 'extends',
    type: 'any',
  },
  StandardResult: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'StandardSuccessResult',
          href: '../StandardSuccessResult/',
          generics: [
            {
              type: 'custom',
              name: 'TOutput',
            },
          ],
        },
        {
          type: 'custom',
          name: 'StandardFailureResult',
          href: '../StandardFailureResult/',
        },
      ],
    },
  },
};
