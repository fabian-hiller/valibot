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
  Schema: {
    type: {
      type: 'custom',
      name: 'LiteralSchema',
      href: '../LiteralSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TLiteral',
        },
      ],
    },
  },
};
