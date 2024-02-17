import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'OptionalSchema',
          href: '../OptionalSchema/',
          generics: ['any', 'any'],
        },
        {
          type: 'custom',
          name: 'OptionalSchemaAsync',
          href: '../OptionalSchemaAsync/',
          generics: ['any', 'any'],
        },
        {
          type: 'custom',
          name: 'NullableSchema',
          href: '../NullableSchema/',
          generics: ['any', 'any'],
        },
        {
          type: 'custom',
          name: 'NullableSchemaAsync',
          href: '../NullableSchemaAsync/',
          generics: ['any', 'any'],
        },
        {
          type: 'custom',
          name: 'NullishSchema',
          href: '../NullishSchema/',
          generics: ['any', 'any'],
        },
        {
          type: 'custom',
          name: 'NullishSchemaAsync',
          href: '../NullishSchemaAsync/',
          generics: ['any', 'any'],
        },
        {
          type: 'custom',
          name: 'NonOptionalSchema',
          href: '../NonOptionalSchema/',
          generics: ['any'],
        },
        {
          type: 'custom',
          name: 'NonOptionalSchemaAsync',
          href: '../NonOptionalSchemaAsync/',
          generics: ['any'],
        },
        {
          type: 'custom',
          name: 'NonNullableSchema',
          href: '../NonNullableSchema/',
          generics: ['any'],
        },
        {
          type: 'custom',
          name: 'NonNullableSchemaAsync',
          href: '../NonNullableSchemaAsync/',
          generics: ['any'],
        },
        {
          type: 'custom',
          name: 'NonNullishSchema',
          href: '../NonNullishSchema/',
          generics: ['any'],
        },
        {
          type: 'custom',
          name: 'NonNullishSchemaAsync',
          href: '../NonNullishSchemaAsync/',
          generics: ['any'],
        },
      ],
    },
  },
  schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
      indexes: [
        {
          type: 'string',
          value: 'wrapped',
        },
      ],
    },
  },
};
