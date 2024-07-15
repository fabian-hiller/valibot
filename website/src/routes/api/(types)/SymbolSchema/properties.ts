import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TMessage: {
    modifier: 'extends',
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
  BaseSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        'symbol',
        'symbol',
        {
          type: 'custom',
          name: 'SymbolIssue',
          href: '../SymbolIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'symbol',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'symbol',
      href: '../symbol/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'symbol',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
