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
              name: 'VoidIssue',
              href: '../VoidIssue/',
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
        'void',
        'void',
        {
          type: 'custom',
          name: 'VoidIssue',
          href: '../VoidIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'void',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'void',
      href: '../void/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'void',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
