import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  reviver: {
    type: {
      type: 'function',
      params: [
        {
          name: 'this',
          type: 'any',
        },
        {
          name: 'key',
          type: 'string',
        },
        {
          name: 'value',
          type: 'any',
        },
      ],
      return: 'any',
    },
  },
};
