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
          generics: [
            {
              type: 'custom',
              name: 'BigintIssue',
              href: '../BigintIssue/',
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
        'bigint',
        'bigint',
        {
          type: 'custom',
          name: 'BigintIssue',
          href: '../BigintIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'bigint',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'bigint',
      href: '../bigint/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'bigint',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
