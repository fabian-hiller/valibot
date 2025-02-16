import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  message: {
    type: 'string',
  },
  path: {
    type: {
      type: 'union',
      options: [
        {
          type: 'array',
          modifier: 'readonly',
          item: {
            type: 'union',
            options: [
              {
                type: 'custom',
                name: 'PropertyKey',
              },
              {
                type: 'custom',
                name: 'StandardPathItem',
                href: '../StandardPathItem/',
              },
            ],
          },
        },
        'undefined',
      ],
    },
  },
};
