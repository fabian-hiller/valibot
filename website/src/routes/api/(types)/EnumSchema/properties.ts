import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
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
          name: 'TOutput',
          default: {
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
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'enum',
    },
  },
  enum: {
    type: {
      type: 'custom',
      name: 'TEnum',
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
