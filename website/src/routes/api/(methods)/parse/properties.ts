import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
    },
  },
  schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
  input: {
    type: 'unknown',
  },
  config: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'SchemaConfig',
          href: '../SchemaConfig/',
        },
        'undefined',
      ],
    },
  },
  output: {
    type: {
      type: 'custom',
      name: 'Output',
      href: '../Output/',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
      ],
    },
  },
};
