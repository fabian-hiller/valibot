import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TOutput: {
    modifier: 'extends',
    type: 'any',
    default: 'undefined',
  },
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        'undefined',
        {
          type: 'custom',
          name: 'TOutput',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'undefined',
    },
  },
  message: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ErrorMessage',
          href: '../ErrorMessage/',
        },
        'undefined',
      ],
    },
  },
};
