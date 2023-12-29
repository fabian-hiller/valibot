import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  issues: {
    type: {
      type: 'tuple',
      items: [
        {
          type: 'custom',
          name: 'Issue',
          href: '../Issue/',
        },
        {
          type: 'array',
          spread: true,
          item: {
            type: 'custom',
            name: 'Issue',
            href: '../Issue/',
          },
        },
      ],
    },
  },
};
