import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TEnum: {
    modifier: 'extends',
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
    default: {
      type: 'string',
      value: 'Invalid type',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'EnumSchema',
      href: '../EnumSchema/',
    },
  },
};
