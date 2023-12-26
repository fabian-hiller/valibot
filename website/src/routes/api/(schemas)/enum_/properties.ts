import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TEnum: {
    type: {
      type: 'custom',
      name: 'Enum',
      href: '../Enum/',
    },
  },
  enum_: {
    type: {
      type: 'custom',
      name: 'TEnum',
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
  Schema: {
    type: [
      {
        type: 'custom',
        name: 'EnumSchema',
        href: '../EnumSchema/',
      },
    ],
  },
};
