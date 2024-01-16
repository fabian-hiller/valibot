import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TClass: {
    type: {
      type: 'custom',
      name: 'Class',
      href: '../Class/',
    },
  },
  class_: {
    type: {
      type: 'custom',
      name: 'TClass',
    },
  },
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
            name: 'TClass',
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
        name: 'InstanceSchema',
        href: '../InstanceSchema/',
      },
    ],
  },
};
