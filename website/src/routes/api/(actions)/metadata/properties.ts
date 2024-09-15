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
  metadata_: {
    type: {
      type: 'custom',
      name: 'TMetadata',
    },
  },
  Action: {
    type: {
      type: 'custom',
      name: 'MetadataAction',
      href: '../MetadataAction/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'TMetadata',
        },
      ],
    },
  },
};
