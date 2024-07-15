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
              name: 'NanIssue',
              href: '../NanIssue/',
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
        'number',
        'number',
        {
          type: 'custom',
          name: 'NanIssue',
          href: '../NanIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'nan',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'readonly',
      name: 'nan',
      href: '../nan/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'NaN',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
