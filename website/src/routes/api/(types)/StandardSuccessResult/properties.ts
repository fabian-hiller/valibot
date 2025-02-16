import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TOutput: {
    modifier: 'extends',
    type: 'any',
  },
  value: {
    type: {
      type: 'custom',
      name: 'TOutput',
    },
  },
  issues: {
    type: 'undefined',
  },
};
