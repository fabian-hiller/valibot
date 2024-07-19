import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TTuple: {
    modifier: 'extends',
    type: {
      type: 'tuple',
      items: [
        'unknown',
        {
          type: 'array',
          spread: true,
          item: 'unknown',
        },
      ],
    },
  },
  LastTupleItem: {
    type: {
      type: 'custom',
      name: 'TTuple',
      indexes: [
        {
          type: 'conditional',
          conditions: [
            {
              type: {
                type: 'custom',
                name: 'TTuple',
              },
              extends: {
                type: 'tuple',
                items: [
                  'unknown',
                  {
                    type: 'custom',
                    spread: true,
                    name: 'TRest',
                  },
                ],
              },
              true: {
                type: 'custom',
                name: 'TRest',
                indexes: [
                  {
                    type: 'string',
                    value: 'length',
                  },
                ],
              },
            },
          ],
          false: 'never',
        },
      ],
    },
  },
};
