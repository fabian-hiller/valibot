import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  SchemaResult: {
    type: [
      {
        type: 'custom',
        name: 'TypedSchemaResult',
        href: '../TypedSchemaResult/',
        generics: [{ type: 'custom', name: 'TOutput' }],
      },
      {
        type: 'custom',
        name: 'UntypedSchemaResult',
        href: '../UntypedSchemaResult/',
      },
    ],
  },
};
