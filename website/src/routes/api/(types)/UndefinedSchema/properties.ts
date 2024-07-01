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
              name: 'UndefinedIssue',
              href: '../UndefinedIssue/',
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
        'undefined',
        'undefined',
        {
          type: 'custom',
          name: 'UndefinedIssue',
          href: '../UndefinedIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'undefined',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'undefined',
      href: '../undefined/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'undefined',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
