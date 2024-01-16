import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: [
      {
        type: 'custom',
        name: 'BaseSchema',
        href: '../BaseSchema/',
        generics: ['never'],
      },
    ],
  },
  type: {
    type: {
      type: 'string',
      value: 'never',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'ErrorMessage',
      href: '../ErrorMessage/',
    },
  },
};
