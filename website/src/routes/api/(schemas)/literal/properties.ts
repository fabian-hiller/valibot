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
  TMessage: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ErrorMessage',
          href: '../ErrorMessage/',
          generics: [
            {
              type: 'custom',
              name: 'LiteralIssue',
              href: '../LiteralIssue/',
            },
          ],
        },
        'undefined',
      ],
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
      type: 'custom',
      name: 'TMessage',
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
        {
          type: 'custom',
          name: 'TMessage',
        },
      ],
    },
  },
};
