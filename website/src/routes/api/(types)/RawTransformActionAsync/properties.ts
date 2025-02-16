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
        {
          type: 'custom',
          name: 'RawTransformIssue',
          href: '../RawTransformIssue/',
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
  type: {
    type: {
      type: 'string',
      value: 'raw_transform',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'rawTransformAsync',
      href: '../rawTransformAsync/',
    },
  },
};
