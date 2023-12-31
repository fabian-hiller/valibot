import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  Pipe: {
    type: {
      type: 'array',
      item: [
        {
          type: 'custom',
          name: 'BaseValidation',
          href: '../BaseValidation/',
          generics: [
            {
              type: 'custom',
              name: 'TInput',
            },
          ],
        },
        {
          type: 'custom',
          name: 'BaseTransformation',
          href: '../BaseTransformation/',
          generics: [
            {
              type: 'custom',
              name: 'TInput',
            },
          ],
        },
      ],
    },
  },
};
