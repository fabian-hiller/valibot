import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  type: {
    type: {
      type: 'string',
      value: 'array',
    },
  },
  origin: {
    type: {
      type: 'string',
      value: 'value',
    },
  },
  input: {
    type: {
      type: 'custom',
      name: 'MaybeReadonly',
      href: '../MaybeReadonly/',
      generics: [
        {
          type: 'array',
          item: 'unknown',
        },
      ],
    },
  },
};
