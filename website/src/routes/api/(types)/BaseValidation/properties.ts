import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  BaseValidation: {
    type: {
      type: 'custom',
      name: 'Object',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
  expects: {
    type: {
      type: 'union',
      options: ['string', 'null'],
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
          type: {
            type: 'custom',
            name: 'TInput',
          },
        },
      ],
      return: {
        type: 'custom',
        name: 'PipeActionResult',
        href: '../PipeActionResult/',
        generics: [
          {
            type: 'custom',
            name: 'TInput',
          },
        ],
      },
    },
  },
};
