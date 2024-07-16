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
              name: 'FileIssue',
              href: '../FileIssue/',
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
          name: 'File',
        },
        {
          type: 'custom',
          name: 'File',
        },
        {
          type: 'custom',
          name: 'FileIssue',
          href: '../FileIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'file',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'file',
      href: '../file/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'File',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
