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
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TEnum',
          indexes: [
            {
              type: 'custom',
              modifier: 'keyof',
              name: 'TEnum',
            },
          ],
        },
        {
          type: 'custom',
          name: 'TEnum',
          indexes: [
            {
              type: 'custom',
              modifier: 'keyof',
              name: 'TEnum',
            },
          ],
        },
        {
          type: 'custom',
          name: 'EnumIssue',
          href: '../EnumIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'enum',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'enum',
      href: '../enum/',
    },
  },
  enum: {
    type: {
      type: 'custom',
      name: 'TEnum',
    },
  },
  options: {
    type: {
      type: 'array',
      item: {
        type: 'custom',
        name: 'TEnum',
        indexes: [
          {
            type: 'custom',
            modifier: 'keyof',
            name: 'TEnum',
          },
        ],
      },
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
