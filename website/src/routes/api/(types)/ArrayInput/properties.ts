import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  ArrayInput: {
    type: {
      type: 'array',
      modifier: 'readonly',
      item: 'unknown',
    },
  },
};
