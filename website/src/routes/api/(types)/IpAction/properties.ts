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
      value: 'ip',
    },
  },
  requirement: {
    type: {
      type: 'tuple',
      items: [
        {
          type: 'custom',
          name: 'RegExp',
        },
        {
          type: 'custom',
          name: 'RegExp',
        },
      ],
    },
  },
};
