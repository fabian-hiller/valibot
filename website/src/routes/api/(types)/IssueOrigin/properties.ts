import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  origin: {
    type: [
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
};
