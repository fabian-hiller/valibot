import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  BaseTransformation: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseTransformation',
      href: '../BaseTransformation/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'Readonly',
          generics: [
            {
              type: 'custom',
              name: 'TInput',
            },
          ],
        },
        'never',
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'readonly',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'readonly',
      href: '../readonly/',
    },
  },
};
