import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
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
          name: 'TOutput',
        },
        'never',
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'transform',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'transformAsync',
      href: '../transformAsync/',
    },
  },
  operation: {
    type: {
      type: 'function',
      params: [
        {
          name: 'input',
          type: {
            type: 'custom',
            name: 'TInput',
          },
        },
      ],
      return: {
        type: 'custom',
        name: 'Promise',
        generics: [
          {
            type: 'custom',
            name: 'TOutput',
          },
        ],
      },
    },
  },
};
