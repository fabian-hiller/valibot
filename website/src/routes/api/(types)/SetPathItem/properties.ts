import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  type: {
    type: {
      type: 'string',
      value: 'set',
    },
  },
  input: {
    type: {
      type: 'custom',
      name: 'Set',
      generics: ['unknown'],
    },
  },
};
