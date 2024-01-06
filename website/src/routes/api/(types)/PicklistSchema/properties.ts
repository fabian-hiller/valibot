import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: [
      {
        type: 'custom',
        name: 'BaseSchema',
        href: '../BaseSchema/',
        generics: [
          {
            type: 'custom',
            name: 'TOptions',
            indexes: ['number'],
          },
          {
            type: 'custom',
            name: 'TOutput',
            default: {
              type: 'custom',
              name: 'TOptions',
              indexes: ['number'],
            },
          },
        ],
      },
    ],
  },
  type: {
    type: {
      type: 'string',
      value: 'picklist',
    },
  },
  options: {
    type: {
      type: 'custom',
      name: 'TOptions',
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
