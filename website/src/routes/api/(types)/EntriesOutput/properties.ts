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
  EntriesOutput: {
    type: {
      type: 'object',
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
          value: {
            type: 'custom',
            name: 'Output',
            href: '../Output/',
            generics: [
              {
                type: 'custom',
                name: 'TEntries',
                indexes: [
                  {
                    type: 'custom',
                    name: 'TKey',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },
};
