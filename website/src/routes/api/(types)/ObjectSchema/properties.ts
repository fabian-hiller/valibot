import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: [
      {
        type: 'custom',
        name: 'BaseSchema',
        href: '../BaseSchema/',
        generics: [
          'any',
          {
            type: 'custom',
            name: 'TOutput',
            default: 'any',
          },
        ],
      },
    ],
  },
  type: {
    type: {
      type: 'string',
      value: 'any',
    },
  },
  pipe: {
    type: [
      {
        type: 'custom',
        name: 'Pipe',
        href: '../Pipe/',
        generics: ['any'],
      },
      'undefined',
    ],
  },
};
