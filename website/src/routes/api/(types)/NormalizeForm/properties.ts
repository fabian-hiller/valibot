import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  NormalizeForm: {
    type: {
      type: 'union',
      options: [
        {
          type: 'string',
          value: 'NFC',
        },
        {
          type: 'string',
          value: 'NFD',
        },
        {
          type: 'string',
          value: 'NFKC',
        },
        {
          type: 'string',
          value: 'NFKD',
        },
      ],
    },
  },
};
