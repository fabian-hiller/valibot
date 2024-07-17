import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'Promise',
      generics: ['unknown'],
    },
  },
  BaseTransformationAsync: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseTransformationAsync',
      href: '../BaseTransformationAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'Awaited',
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
      value: 'await',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'awaitAsync',
      href: '../awaitAsync/',
    },
  },
};
