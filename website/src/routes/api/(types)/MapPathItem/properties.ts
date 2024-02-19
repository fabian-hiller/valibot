import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  type: {
    type: {
      type: 'string',
      value: 'map',
    },
  },
  origin: {
    type: {
      type: 'union',
      options: [
        {
          type: 'string',
          value: 'key',
        },
        {
          type: 'string',
          value: 'value',
        },
      ],
    },
  },
  input: {
    type: {
      type: 'custom',
      name: 'Map',
      generics: ['unknown', 'unknown'],
    },
  },
};
