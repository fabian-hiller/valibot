import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TMetadata: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'Record',
      generics: ['string', 'unknown'],
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
      value: 'metadata',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'metadata',
      href: '../metadata/',
    },
  },
  metadata_: {
    type: {
      type: 'custom',
      name: 'TMetadata',
    },
  },
};
