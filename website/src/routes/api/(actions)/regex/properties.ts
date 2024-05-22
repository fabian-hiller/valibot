import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'string',
  },
  requirement: {
    type: {
      type: 'custom',
      name: 'RegExp',
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
      name: 'RegexValidation',
      href: '../RegexValidation/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
};
