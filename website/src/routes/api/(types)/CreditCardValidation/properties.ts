import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'string',
  },
  BaseValidation: {
    type: {
      type: 'custom',
      name: 'BaseValidation',
      href: '../BaseValidation/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'credit_card',
    },
  },
  requirement: {
    type: {
      type: 'function',
      params: [
        {
          name: 'input',
          type: { type: 'custom', name: 'TInput' },
        },
      ],
      return: 'boolean',
    },
  },
};
