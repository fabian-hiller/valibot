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
  Action: {
    type: {
      type: 'custom',
      name: 'AwaitActionAsync',
      href: '../AwaitActionAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
};
