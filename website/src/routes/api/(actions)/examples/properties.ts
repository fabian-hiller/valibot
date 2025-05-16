import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TExamples: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ArrayInput',
      href: '../ArrayInput/',
    },
  },
  examples_: {
    type: {
      type: 'custom',
      name: 'TExamples',
    },
  },
  Action: {
    type: {
      type: 'custom',
      name: 'ExamplesAction',
      href: '../ExamplesAction/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'TExamples',
        },
      ],
    },
  },
};
