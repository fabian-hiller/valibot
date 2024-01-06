import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  type: {
    type: {
      type: 'string',
      value: 'map',
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
