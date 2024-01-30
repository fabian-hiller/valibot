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
  BaseSchemaAsync: {
    type: {
      type: 'custom',
      name: 'BaseSchemaAsync',
      href: '../BaseSchemaAsync/',
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
  type: {
    type: {
      type: 'string',
      value: 'special',
    },
  },
  check: {
    type: {
      type: 'function',
      params: [
        {
          name: 'input',
          type: 'unknown',
        },
      ],
      return: {
        type: 'union',
        options: [
          'boolean',
          {
            type: 'custom',
            name: 'Promise',
            generics: ['boolean'],
          },
        ],
      },
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'ErrorMessage',
      href: '../ErrorMessage/',
    },
  },
  pipe: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'PipeaAsync',
          href: '../PipeaAsync/',
          generics: [
            {
              type: 'custom',
              name: 'TInput',
            },
          ],
        },
        'undefined',
      ],
    },
  },
};
