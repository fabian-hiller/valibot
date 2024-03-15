import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TupleItems: {
    type: {
      type: 'tuple',
      items: [
        {
          type: 'custom',
          name: 'BaseSchema',
          href: '../BaseSchema/',
        },
        {
          type: 'array',
          spread: true,
          item: {
            type: 'custom',
            name: 'BaseSchema',
            href: '../BaseSchema/',
          },
        },
      ],
    },
  },
};
