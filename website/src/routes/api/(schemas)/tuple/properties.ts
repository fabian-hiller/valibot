import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TItems: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'TupleItems',
      href: '../TupleItems/',
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
              name: 'TupleIssue',
              href: '../TupleIssue/',
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
      name: 'TupleSchema',
      href: '../TupleSchema/',
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
