import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TOutput: {
    modifier: 'extends',
    type: 'any',
  },
  SchemaResult: {
    type: {
      type: 'union',
      options: [
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
  },
};
