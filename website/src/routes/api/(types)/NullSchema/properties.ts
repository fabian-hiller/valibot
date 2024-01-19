import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        'null',
        {
          type: 'custom',
          name: 'TOutput',
          default: 'null',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'null',
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
