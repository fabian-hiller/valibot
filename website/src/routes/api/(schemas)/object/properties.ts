import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TEntries: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ObjectEntries',
      href: '../ObjectEntries/',
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
              name: 'ObjectIssue',
              href: '../ObjectIssue/',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  entries: {
    type: {
      type: 'custom',
      name: 'TEntries',
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
      name: 'ObjectSchema',
      href: '../ObjectSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TEntries',
        },
        {
          type: 'custom',
          name: 'TMessage',
        },
      ],
    },
  },
};
