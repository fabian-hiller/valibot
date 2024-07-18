import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  ValueInput: {
    type: {
      type: 'union',
      options: [
        'string',
        'number',
        'bigint',
        'boolean',
        {
          type: 'custom',
          name: 'Date',
        },
      ],
    },
  },
};
