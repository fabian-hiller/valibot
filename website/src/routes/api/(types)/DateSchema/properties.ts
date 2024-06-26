import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TMessage: {
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
              name: 'DateIssue',
              href: '../DateIssue/',
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
        {
          type: 'custom',
          name: 'Date',
        },
        {
          type: 'custom',
          name: 'Date',
        },
        {
          type: 'custom',
          name: 'DateIssue',
          href: '../DateIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'date',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'date',
      href: '../date/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'Date',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
