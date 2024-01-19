import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        'number',
        {
          type: 'custom',
          name: 'TOutput',
          default: 'number',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'nan',
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
