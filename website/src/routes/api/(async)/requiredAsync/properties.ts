import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
<<<<<<< HEAD
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'SchemaWithoutPipe',
      href: '../SchemaWithoutPipe/',
      generics: [
        {
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'LooseObjectSchemaAsync',
              href: '../LooseObjectSchemaAsync/',
              generics: [
                {
                  type: 'custom',
                  name: 'ObjectEntriesAsync',
                  href: '../ObjectEntriesAsync/',
                },
                {
                  type: 'union',
                  options: [
                    {
                      type: 'custom',
                      name: 'ErrorMessage',
                      href: '../ErrorMessage/',
                      generics: [
                        {
                          type: 'custom',
                          name: 'LooseObjectIssue',
                          href: '../LooseObjectIssue/',
                        },
                      ],
                    },
                    'undefined',
                  ],
                },
              ],
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
                {
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
              ],
            },
            {
              type: 'custom',
              name: 'ObjectWithRestSchemaAsync',
              href: '../ObjectWithRestSchemaAsync/',
              generics: [
                {
                  type: 'custom',
                  name: 'ObjectEntriesAsync',
                  href: '../ObjectEntriesAsync/',
                },
                {
                  type: 'union',
                  options: [
                    {
                      type: 'custom',
                      name: 'BaseSchema',
                      href: '../BaseSchema/',
                      generics: [
                        'unknown',
                        'unknown',
                        {
                          type: 'custom',
                          name: 'BaseIssue',
                          href: '../BaseIssue/',
                          generics: ['unknown'],
                        },
                      ],
                    },
                    {
                      type: 'custom',
                      name: 'BaseSchemaAsync',
                      href: '../BaseSchemaAsync/',
                      generics: [
                        'unknown',
                        'unknown',
                        {
                          type: 'custom',
                          name: 'BaseIssue',
                          href: '../BaseIssue/',
                          generics: ['unknown'],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'union',
                  options: [
                    {
                      type: 'custom',
                      name: 'ErrorMessage',
                      href: '../ErrorMessage/',
                      generics: [
                        {
                          type: 'custom',
                          name: 'ObjectWithRestIssue',
                          href: '../ObjectWithRestIssue/',
                        },
                      ],
                    },
                    'undefined',
                  ],
                },
              ],
            },
            {
              type: 'custom',
              name: 'StrictObjectSchemaAsync',
              href: '../StrictObjectSchemaAsync/',
              generics: [
                {
                  type: 'custom',
                  name: 'ObjectEntriesAsync',
                  href: '../ObjectEntriesAsync/',
                },
                {
                  type: 'union',
                  options: [
                    {
                      type: 'custom',
                      name: 'ErrorMessage',
                      href: '../ErrorMessage/',
                      generics: [
                        {
                          type: 'custom',
                          name: 'StrictObjectIssue',
                          href: '../StrictObjectIssue/',
                        },
                      ],
                    },
                    'undefined',
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  TKeys: {
    type: {
      type: 'custom',
      name: 'ObjectKeys',
      href: '../ObjectKeys/',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
      ],
    },
  },
  TMessage: {
    type: {
=======
  TKey: {
    modifier: 'extends',
    type: {
>>>>>>> 7ff23862 (docs: document async apis)
      type: 'union',
      options: [
        {
          type: 'custom',
<<<<<<< HEAD
          name: 'ErrorMessage',
          href: '../ErrorMessage/',
          generics: [
            {
              type: 'custom',
              name: 'NonOptionalIssue',
              href: '../NonOptionalIssue/',
            },
          ],
        },
=======
          name: 'BaseSchema',
          href: '../BaseSchema/',
          generics: [
            'unknown',
            'unknown',
            {
              type: 'custom',
              name: 'BaseIssue',
              href: '../BaseIssue/',
              generics: ['unknown'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'BaseSchemaAsync',
          href: '../BaseSchemaAsync/',
          generics: [
            'unknown',
            'unknown',
            {
              type: 'custom',
              name: 'BaseIssue',
              href: '../BaseIssue/',
              generics: ['unknown'],
            },
          ],
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
          generics: [
            'unknown',
            'unknown',
            {
              type: 'custom',
              name: 'BaseIssue',
              href: '../BaseIssue/',
              generics: ['unknown'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'BaseSchemaAsync',
          href: '../BaseSchemaAsync/',
          generics: [
            'unknown',
            'unknown',
            {
              type: 'custom',
              name: 'BaseIssue',
              href: '../BaseIssue/',
              generics: ['unknown'],
            },
          ],
        },
      ],
    },
  },
  TDefault: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'Default',
      href: '../Default/',
      generics: [
        {
          type: 'custom',
          name: 'TWrapped',
        },
>>>>>>> 7ff23862 (docs: document async apis)
        'undefined',
      ],
    },
  },
<<<<<<< HEAD
  schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
  keys: {
=======
  key: {
>>>>>>> 7ff23862 (docs: document async apis)
    type: {
      type: 'custom',
      name: 'TKey',
    },
  },
<<<<<<< HEAD
=======
  value: {
    type: {
      type: 'custom',
      name: 'TValue',
    },
  },
>>>>>>> 7ff23862 (docs: document async apis)
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
<<<<<<< HEAD
  AllKeysSchema: {
    type: {
      type: 'custom',
      name: 'SchemaWithRequiredAsync',
      href: '../SchemaWithRequiredAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
        'undefined',
        {
          type: 'custom',
          name: 'TMessage',
        },
      ],
    },
  },
  SelectedKeysSchema: {
    type: {
      type: 'custom',
      name: 'SchemaWithRequiredAsync',
      href: '../SchemaWithRequiredAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
        {
          type: 'custom',
          name: 'TKeys',
        },
        {
          type: 'custom',
          name: 'TMessage',
=======
  Schema: {
    type: {
      type: 'custom',
      name: 'nullableAsync',
      href: '../nullableAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TWrapped',
        },
        {
          type: 'custom',
          name: 'TDefault',
>>>>>>> 7ff23862 (docs: document async apis)
        },
      ],
    },
  },
};
