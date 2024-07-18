import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  PartialInput: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Record',
          generics: ['string', 'unknown'],
        },
        {
          type: 'custom',
          name: 'ArrayLike',
          generics: ['unknown'],
        },
      ],
    },
  },
};
