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
  TOutput: {
    modifier: 'extends',
    type: 'any',
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
  BaseSchemaAsync: {
    type: {
      type: 'custom',
      name: 'BaseSchemaAsync',
      href: '../BaseSchemaAsync/',
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
