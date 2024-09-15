import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TTitle: {
    modifier: 'extends',
    type: 'string',
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
      value: 'title',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'title',
      href: '../title/',
    },
  },
  title: {
    type: {
      type: 'custom',
      name: 'TTitle',
    },
  },
};
