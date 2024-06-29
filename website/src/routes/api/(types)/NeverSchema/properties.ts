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
              name: 'NeverIssue',
              href: '../NeverIssue/',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        'never',
        'never',
        {
          type: 'custom',
          name: 'NeverIssue',
          href: '../NeverIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'never',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'readonly',
      name: 'never',
      href: '../never/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'never',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
