import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TEntries: {
    type: [
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
  TObject: {
    type: [
      {
        type: 'custom',
        name: 'EntriesInput',
        href: '../EntriesInput/',
        generics: [
          {
            type: 'custom',
            name: 'TEntries',
          },
        ],
      },
      {
        type: 'custom',
        name: 'EntriesOutput',
        href: '../EntriesOutput/',
        generics: [
          {
            type: 'custom',
            name: 'TEntries',
          },
        ],
      },
    ],
  },
  OptionalKeys: {
    type: {
      type: 'object',
      index: {
        type: 'custom',
        modifier: 'keyof',
        name: 'TEntries',
      },
      entries: [
        {
          key: {
            name: 'TKey',
            type: {
              type: 'custom',
              modifier: 'keyof',
              name: 'TEntries',
            },
          },
          value: [
            {
              type: 'custom',
              name: 'TKey',
            },
            {
              type: 'custom',
              name: 'never',
            },
          ],
        },
      ],
    },
  },
};
