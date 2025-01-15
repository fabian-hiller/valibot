import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
  },
  input: {
    type: {
      type: 'custom',
      name: 'TInput',
    },
  },
  output: {
    type: {
      type: 'custom',
      name: 'TOutput',
    },
  },
};
