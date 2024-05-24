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
  TMessage: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ErrorMessage',
          href: '../ErrorMessage/',
          generics: [
            {
              type: 'custom',
              name: 'EnumIssue',
              href: '../EnumIssue/',
            },
          ],
        },
        'undefined',
      ],
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
      type: 'custom',
      name: 'TMessage',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'EnumSchema',
      href: '../EnumSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TEnum',
        },
        {
          type: 'custom',
          name: 'TMessage',
        },
      ],
    },
  },
};
