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
  EntriesInput: {
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
            name: 'Input',
            href: '../Input/',
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
