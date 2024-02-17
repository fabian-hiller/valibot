import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TLiteral: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'Literal',
      href: '../Literal/',
    },
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
    default: {
      type: 'custom',
      name: 'TLiteral',
    },
  },
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TLiteral',
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
      value: 'literal',
    },
  },
  literal: {
    type: {
      type: 'custom',
      name: 'TLiteral',
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
};
