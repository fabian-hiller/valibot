import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'SchemaWithMaybeDefault',
          href: '../SchemaWithMaybeDefault/',
          generics: [
            {
              type: 'union',
              options: [
                {
                  type: 'custom',
                  name: 'BaseSchema',
                  href: '../BaseSchema/',
                },
                {
                  type: 'custom',
                  name: 'ObjectSchema',
                  href: '../ObjectSchema/',
                  generics: [
                    {
                      type: 'custom',
                      name: 'ObjectEntries',
                      href: '../ObjectEntries/',
                    },
                    'any',
                  ],
                },
                {
                  type: 'custom',
                  name: 'TupleSchema',
                  href: '../TupleSchema/',
                  generics: [
                    {
                      type: 'custom',
                      name: 'TupleItems',
                      href: '../TupleItems/',
                    },
                    'any',
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'custom',
          name: 'SchemaWithMaybeDefaultAsync',
          href: '../SchemaWithMaybeDefaultAsync/',
          generics: [
            {
              type: 'union',
              options: [
                {
                  type: 'custom',
                  name: 'BaseSchemaAsync',
                  href: '../BaseSchemaAsync/',
                },
                {
                  type: 'custom',
                  name: 'ObjectSchemaAsync',
                  href: '../ObjectSchemaAsync/',
                  generics: [
                    {
                      type: 'custom',
                      name: 'ObjectEntriesAsync',
                      href: '../ObjectEntriesAsync/',
                    },
                    'any',
                  ],
                },
                {
                  type: 'custom',
                  name: 'TupleSchemaAsync',
                  href: '../TupleSchemaAsync/',
                  generics: [
                    {
                      type: 'custom',
                      name: 'TupleItemsAsync',
                      href: '../TupleItemsAsync/',
                    },
                    'any',
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  DefaultValues: {
    type: {
      type: 'conditional',
      conditions: [
        {
          type: {
            type: 'custom',
            name: 'TSchema',
          },
          extends: {
            type: 'custom',
            name: 'ObjectSchema',
            href: '../ObjectSchema/',
            generics: [
              {
                type: 'custom',
                modifier: 'infer',
                name: 'TEntries',
              },
            ],
          },
          true: {
            type: 'object',
            entries: [
              {
                key: {
                  name: 'TKey',
                  modifier: 'in keyof',
                  type: {
                    type: 'custom',
                    name: 'TEntries',
                  },
                },
                value: {
                  type: 'custom',
                  name: 'DefaultValues',
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
        {
          type: {
            type: 'custom',
            name: 'TSchema',
          },
          extends: {
            type: 'custom',
            name: 'ObjectSchemaAsync',
            href: '../ObjectSchemaAsync/',
            generics: [
              {
                type: 'custom',
                modifier: 'infer',
                name: 'TEntries',
              },
            ],
          },
          true: {
            type: 'object',
            entries: [
              {
                key: {
                  name: 'TKey',
                  modifier: 'in keyof',
                  type: {
                    type: 'custom',
                    name: 'TEntries',
                  },
                },
                value: {
                  type: 'custom',
                  name: 'DefaultValues',
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
        {
          type: {
            type: 'custom',
            name: 'TSchema',
          },
          extends: {
            type: 'custom',
            name: 'TupleSchema',
            href: '../TupleSchema/',
            generics: [
              {
                type: 'custom',
                modifier: 'infer',
                name: 'TItems',
              },
            ],
          },
          true: {
            type: 'object',
            entries: [
              {
                key: {
                  name: 'TKey',
                  modifier: 'in keyof',
                  type: {
                    type: 'custom',
                    name: 'TItems',
                  },
                },
                value: {
                  type: 'custom',
                  name: 'DefaultValues',
                  generics: [
                    {
                      type: 'custom',
                      name: 'TItems',
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
        {
          type: {
            type: 'custom',
            name: 'TSchema',
          },
          extends: {
            type: 'custom',
            name: 'TupleSchemaAsync',
            href: '../TupleSchemaAsync/',
            generics: [
              {
                type: 'custom',
                modifier: 'infer',
                name: 'TItems',
              },
            ],
          },
          true: {
            type: 'object',
            entries: [
              {
                key: {
                  name: 'TKey',
                  modifier: 'in keyof',
                  type: {
                    type: 'custom',
                    name: 'TItems',
                  },
                },
                value: {
                  type: 'custom',
                  name: 'DefaultValues',
                  generics: [
                    {
                      type: 'custom',
                      name: 'TItems',
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
      ],
      false: {
        type: 'custom',
        name: 'DefaultValue',
        href: '../DefaultValue/',
        generics: [
          {
            type: 'custom',
            name: 'TSchema',
          },
        ],
      },
    },
  },
};
