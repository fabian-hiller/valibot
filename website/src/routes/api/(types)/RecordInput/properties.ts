import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TKey: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'RecordKey',
          href: '../RecordKey/',
        },
        {
          type: 'custom',
          name: 'RecordKeyAsync',
          href: '../RecordKeyAsync/',
        },
      ],
    },
  },
  TValue: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
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
      ],
    },
  },
  RecordInput: {
    type: {
      type: 'conditional',
      conditions: [
        {
          type: {
            type: 'custom',
            name: 'TKey',
          },
          extends: {
            type: 'custom',
            name: 'PartialKeySchema',
            href: '../PartialKeySchema/',
          },
          true: {
            type: 'custom',
            name: 'Partial',
            generics: [
              {
                type: 'custom',
                name: 'Record',
                generics: [
                  {
                    type: 'custom',
                    name: 'Input',
                    href: '../Input/',
                    generics: [
                      {
                        type: 'custom',
                        name: 'TKey',
                      },
                    ],
                  },
                  {
                    type: 'custom',
                    name: 'Input',
                    href: '../Input/',
                    generics: [
                      {
                        type: 'custom',
                        name: 'TValue',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
      false: {
        type: 'custom',
        name: 'Record',
        generics: [
          {
            type: 'custom',
            name: 'Input',
            href: '../Input/',
            generics: [
              {
                type: 'custom',
                name: 'TKey',
              },
            ],
          },
          {
            type: 'custom',
            name: 'Input',
            href: '../Input/',
            generics: [
              {
                type: 'custom',
                name: 'TValue',
              },
            ],
          },
        ],
      },
    },
  },
};
