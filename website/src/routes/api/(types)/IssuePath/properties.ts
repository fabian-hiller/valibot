import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  IssuePath: {
    type: {
      type: 'tuple',
      items: [
        {
          type: 'custom',
          name: 'PathItem',
          href: '../PathItem/',
        },
        {
          type: 'array',
          spread: true,
          item: {
            type: 'custom',
            name: 'PathItem',
            href: '../PathItem/',
          },
        },
      ],
    },
  },
};
