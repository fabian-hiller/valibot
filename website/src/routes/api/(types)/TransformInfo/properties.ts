import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TransformInfo: {
    type: 'object',
  },
  issues: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Issues',
          href: '../Issues/',
        },
        'undefined',
      ],
    },
  },
};
