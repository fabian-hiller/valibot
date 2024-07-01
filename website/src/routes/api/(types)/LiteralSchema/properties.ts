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
  BaseSchema: {
    modifier: 'extends',
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
          name: 'TLiteral',
        },
        {
          type: 'custom',
          name: 'LiteralIssue',
          href: '../LiteralIssue/',
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
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'literal',
      href: '../literal/',
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
};
