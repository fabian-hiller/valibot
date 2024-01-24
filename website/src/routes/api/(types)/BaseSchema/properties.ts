import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
    default: {
      type: 'custom',
      name: 'TInput',
    },
  },
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'Object',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'TOutput',
        },
      ],
    },
  },
  async: {
    type: {
      type: 'boolean',
      value: false,
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
        name: 'SchemaResult',
        href: '../SchemaResult/',
        generics: [{ type: 'custom', name: 'TOutput' }],
      },
    },
  },
  _types: {
    type: {
      type: 'union',
      options: [
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
  },
};
