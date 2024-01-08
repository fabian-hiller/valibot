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
  TRest: {
    type: [
      {
        type: 'custom',
        name: 'BaseSchema',
        href: '../BaseSchema/',
      },
      {
        type: 'custom',
        name: 'BaseSchemaAsync',
        href: '../BaseSchemaAsync/',
      },
      'undefined',
    ],
  },
  ObjectOutput: {
    type: [
      {
        type: 'custom',
        name: 'ResolveObject',
        href: '../ResolveObject/',
        generics: [
          {
            type: 'custom',
            name: 'WithQuestionMarks',
            href: '../WithQuestionMarks/',
            generics: [
              {
                type: 'custom',
                name: 'TEntries',
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
        ],
      },
      [
        {
          type: 'custom',
          name: 'ResolveObject',
          href: '../ResolveObject/',
          generics: [
            {
              type: 'custom',
              name: 'WithQuestionMarks',
              href: '../WithQuestionMarks/',
              generics: [
                {
                  type: 'custom',
                  name: 'TEntries',
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
          ],
        },
        {
          type: 'custom',
          name: 'Record',
          generics: [
            'string',
            {
              type: 'custom',
              name: 'Output',
              href: '../Output/',
              generics: [
                {
                  type: 'custom',
                  name: 'TRest',
                },
              ],
            },
          ],
        },
      ],
      {
        type: 'custom',
        name: 'never',
      },
    ],
  },
};
