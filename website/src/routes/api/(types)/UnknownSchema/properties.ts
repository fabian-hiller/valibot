import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        'unknown',
        {
          type: 'custom',
          name: 'TOutput',
          default: 'unknown',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'unknown',
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
          generics: ['unknown'],
        },
        'undefined',
      ],
    },
  },
};
