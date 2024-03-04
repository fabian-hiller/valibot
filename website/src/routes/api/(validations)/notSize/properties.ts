import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Map',
          generics: ['any', 'any'],
        },
        {
          type: 'custom',
          name: 'Set',
          generics: ['any'],
        },
        {
          type: 'custom',
          name: 'Blob',
        },
      ],
    },
  },
  TRequirement: {
    modifier: 'extends',
    type: 'number',
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
      name: 'NotSizeValidation',
      href: '../NotSizeValidation/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'TRequirement',
        },
      ],
    },
  },
};
