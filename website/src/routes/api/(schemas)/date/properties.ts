import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  message: {
    type: [
      {
        type: 'custom',
        name: 'ErrorMessage',
        href: '../ErrorMessage/',
      },
      'undefined',
    ],
    default: {
      type: 'string',
      value: 'Invalid type',
    },
  },
  pipe: {
    type: [
      {
        type: 'custom',
        name: 'Pipe',
        href: '../Pipe/',
        generics: [
          {
            type: 'custom',
            name: 'Date',
          },
        ],
      },
      'undefined',
    ],
  },
  Schema: {
    type: [
      {
        type: 'custom',
        name: 'DateSchema',
        href: '../DateSchema/',
      },
    ],
  },
};
