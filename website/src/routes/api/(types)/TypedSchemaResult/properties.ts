import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TOutput: {
    modifier: 'extends',
    type: 'any',
  },
  TypedSchemaResult: {
    type: {
      type: 'custom',
      name: 'Object',
      generics: [
        {
          type: 'custom',
          name: 'TOutput',
        },
      ],
    },
  },
  typed: {
    type: {
      type: 'boolean',
      value: true,
    },
  },
  output: {
    type: {
      type: 'custom',
      name: 'TOutput',
    },
  },
  issues: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Issues',
          href: '../Issues/',
        },
        'undefined',
      ],
    },
  },
};
