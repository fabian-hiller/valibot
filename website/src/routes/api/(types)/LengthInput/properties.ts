import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  LengthInput: {
    type: {
      type: 'union',
      options: [
        'string',
        {
          type: 'array',
          item: 'unknown',
        },
      ],
    },
  },
};
