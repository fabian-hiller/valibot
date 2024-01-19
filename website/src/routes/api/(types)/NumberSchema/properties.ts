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
      value: 'number',
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
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Pipe',
          href: '../Pipe/',
          generics: ['number'],
        },
        'undefined',
      ],
    },
  },
};
