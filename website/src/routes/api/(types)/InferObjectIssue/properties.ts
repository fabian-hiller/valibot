import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TEntries: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ObjectEntries',
          href: '../ObjectEntries/',
        },
        {
          type: 'custom',
          name: 'ObjectEntriesAsync',
          href: '../ObjectEntriesAsync/',
        },
      ],
    },
  },
  InferObjectIssue: {
    type: {
      type: 'custom',
      name: 'InferIssue',
      href: '../InferIssue/',
      generics: [
        {
          type: 'custom',
          name: 'TEntries',
          indexes: [
            {
              type: 'custom',
              modifier: 'keyof',
              name: 'TEntries',
            },
          ],
        },
      ],
    },
  },
};
