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
  BaseMetadata: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseMetadata',
      href: '../BaseMetadata/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'examples',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'examples',
      href: '../examples/',
    },
  },
  examples: {
    type: {
      type: 'custom',
      name: 'TExamples',
    },
  },
};
