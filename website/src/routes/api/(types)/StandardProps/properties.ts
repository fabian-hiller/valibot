import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
  },
  version: {
    type: {
      type: 'number',
      value: 1,
    },
  },
  vendor: {
    type: {
      type: 'string',
      value: 'valibot',
    },
  },
  validate: {
    type: {
      type: 'function',
      params: [
        {
          name: 'value',
          type: 'unknown',
        },
      ],
      return: {
        type: 'union',
        options: [
          {
            type: 'custom',
            name: 'StandardResult',
            href: '../StandardResult/',
            generics: [
              {
                type: 'custom',
                name: 'TOutput',
              },
            ],
          },
          {
            type: 'custom',
            name: 'Promise',
            generics: [
              {
                type: 'custom',
                name: 'StandardResult',
                href: '../StandardResult/',
                generics: [
                  {
                    type: 'custom',
                    name: 'TOutput',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
  types: {
    type: {
      type: 'custom',
      name: 'StandardTypes',
      href: '../StandardTypes/',
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
};
