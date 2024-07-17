import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TItem: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'BaseSchema',
          href: '../BaseSchema/',
          generics: [
            'unknown',
            'unknown',
            {
              type: 'custom',
              name: 'BaseIssue',
              href: '../BaseIssue/',
              generics: ['unknown'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'BaseSchemaAsync',
          href: '../BaseSchemaAsync',
          generics: [
            'unknown',
            'unknown',
            {
              type: 'custom',
              name: 'BaseIssue',
              href: '../BaseIssue/',
              generics: ['unknown'],
            },
          ],
        },
      ],
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
              name: 'ArrayIssue',
              href: '../ArrayIssue/',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  item: {
    type: {
      type: 'custom',
      name: 'TItem',
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
      name: 'ArraySchemaAsync',
      href: '../ArraySchemaAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TItem',
        },
        {
          type: 'custom',
          name: 'TMessage',
        },
      ],
    },
  },
};
