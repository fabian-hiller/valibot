import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: [
      {
        type: 'custom',
        name: 'BaseSchema',
        href: '../BaseSchema/',
        generics: [
          'string',
          {
            type: 'custom',
            name: 'TOutput',
            default: 'string',
          },
        ],
      },
    ],
  },
  type: {
    type: {
      type: 'string',
      value: 'string',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'ErrorMessage',
      href: '../ErrorMessage/',
    },
  },
  pipe: {
    type: [
      {
        type: 'custom',
        name: 'Pipe',
        href: '../Pipe/',
        generics: ['string'],
      },
      'undefined',
    ],
  },
};
