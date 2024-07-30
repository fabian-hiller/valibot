import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
    default: 'unknown',
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
};
