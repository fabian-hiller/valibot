import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TItems: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'TupleItemsAsync',
      href: '../TupleItemsAsync/',
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
              name: 'StrictTupleIssue',
              href: '../StrictTupleIssue/',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  items: {
    type: {
      type: 'custom',
      name: 'TItems',
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
      name: 'StrictTupleSchemaAsync',
      href: '../StrictTupleSchemaAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TItems',
        },
        {
          type: 'custom',
          name: 'TMessage',
        },
      ],
    },
  },
};
