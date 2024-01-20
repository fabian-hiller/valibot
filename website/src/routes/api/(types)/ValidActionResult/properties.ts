import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TOutput: {
    modifier: 'extends',
    type: 'any',
  },
  ValidActionResult: {
    type: {
      type: 'custom',
      name: 'Object',
      generics: [
        {
          type: 'custom',
          name: 'TOutput',
        },
      ],
    },
  },
  output: {
    type: {
      type: 'custom',
      name: 'TOutput',
    },
  },
};
