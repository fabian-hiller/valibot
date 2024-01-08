import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchemaAsync: {
    type: {
      type: 'custom',
      name: 'Object',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
          default: 'any',
        },
        {
          type: 'custom',
          name: 'TOutput',
          default: {
            type: 'custom',
            name: 'TInput',
          },
        },
      ],
    },
  },
  async: {
    type: {
      type: 'boolean',
      value: true,
    },
  },
  _parse: {
    type: {
      type: 'function',
      params: [
        {
          name: 'input',
          type: 'unknown',
        },
        {
          name: 'info',
          optional: true,
          type: {
            type: 'custom',
            name: 'ParseInfo',
            href: '../ParseInfo/',
          },
        },
      ],
      return: {
        type: 'custom',
        name: 'Promise',
        generics: [
          {
            type: 'custom',
            name: 'SchemaResult',
            href: '../SchemaResult/',
            generics: [{ type: 'custom', name: 'TOutput' }],
          },
        ],
      },
    },
  },
  _types: {
    type: [
      {
        type: 'object',
        entries: [
          {
            key: 'input',
            value: {
              type: 'custom',
              name: 'TInput',
            },
          },
          {
            key: 'output',
            value: {
              type: 'custom',
              name: 'TOutput',
            },
          },
        ],
      },
      'undefined',
    ],
  },
};
