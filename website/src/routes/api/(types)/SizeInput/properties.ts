import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  SizeInput: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Blob',
        },
        {
          type: 'custom',
          name: 'Map',
          generics: ['unknown', 'unknown'],
        },
        {
          type: 'custom',
          name: 'Set',
          generics: ['unknown'],
        },
      ],
    },
  },
};
