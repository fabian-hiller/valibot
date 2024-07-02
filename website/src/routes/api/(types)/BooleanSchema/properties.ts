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
              name: 'BooleanIssue',
              href: '../BooleanIssue/',
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
        'boolean',
        'boolean',
        {
          type: 'custom',
          name: 'BooleanIssue',
          href: '../BooleanIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'boolean',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'boolean',
      href: '../boolean/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'boolean',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
