import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TDescription: {
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
      value: 'description',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'description',
      href: '../description/',
    },
  },
  description_: {
    type: {
      type: 'custom',
      name: 'TDescription',
    },
  },
};
