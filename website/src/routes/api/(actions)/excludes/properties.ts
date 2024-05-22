import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        'string',
        {
          type: 'array',
          item: 'any',
        },
      ],
    },
  },
  TRequirement: {
    modifier: 'extends',
    type: {
      type: 'conditional',
      conditions: [
        {
          type: {
            type: 'custom',
            name: 'TInput',
            indexes: ['number'],
          },
          extends: {
            type: 'array',
            item: 'any',
          },
          true: {
            type: 'custom',
            name: 'TInput',
            indexes: ['number'],
          },
        },
      ],
      false: {
        type: 'custom',
        name: 'TInput',
      },
    },
  },
  requirement: {
    type: {
      type: 'custom',
      name: 'TRequirement',
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
  Validation: {
    type: {
      type: 'custom',
      name: 'ExcludesValidation',
      href: '../ExcludesValidation/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
};
