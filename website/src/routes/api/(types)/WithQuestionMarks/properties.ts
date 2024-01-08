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
  WithQuestionMarks: {
    type: [
      [
        {
          type: 'custom',
          name: 'Pick',
          generics: [
            { type: 'custom', name: 'TObject' },
            {
              type: 'custom',
              name: 'RequiredKeys',
              href: '../RequiredKeys/',
              generics: [
                { type: 'custom', name: 'TEntries' },
                { type: 'custom', name: 'TObject' },
              ],
            },
          ],
        },
        {
          type: 'custom',
          name: 'Partial',
          generics: [
            {
              type: 'custom',
              name: 'Pick',
              generics: [
                { type: 'custom', name: 'TObject' },
                {
                  type: 'custom',
                  name: 'OptionalKeys',
                  href: '../OptionalKeys/',
                  generics: [
                    { type: 'custom', name: 'TEntries' },
                    { type: 'custom', name: 'TObject' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    ],
  },
};
