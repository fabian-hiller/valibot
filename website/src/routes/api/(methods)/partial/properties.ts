import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
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
              name: 'LooseObjectSchema',
              href: '../LooseObjectSchema/',
              generics: [
                {
                  type: 'custom',
                  name: 'ObjectEntries',
                  href: '../ObjectEntries/',
                },
                {
                  type: 'union',
                  options: [
                    {
                      type: 'custom',
                      name: 'ErrorMessage',
                      generics: [
                        {
                          type: 'custom',
                          name: 'ObjectIssue',
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
              name: 'ObjectSchema',
              href: '../ObjectSchema/',
              generics: [
                {
                  type: 'custom',
                  name: 'ObjectEntries',
                  href: '../ObjectEntries/',
                },
                {
                  type: 'union',
                  options: [
                    {
                      type: 'custom',
                      name: 'ErrorMessage',
                      generics: [
                        {
                          type: 'custom',
                          name: 'ObjectIssue',
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
              name: 'ObjectWithRestSchema',
              href: '../ObjectWithRestSchema/',
              generics: [
                {
                  type: 'custom',
                  name: 'ObjectEntries',
                  href: '../ObjectEntries/',
                },
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
                  type: 'union',
                  options: [
                    {
                      type: 'custom',
                      name: 'ErrorMessage',
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
              name: 'StrictObjectSchema',
              href: '../StrictObjectSchema/',
              generics: [
                {
                  type: 'custom',
                  name: 'ObjectEntries',
                  href: '../ObjectEntries/',
                },
                {
                  type: 'union',
                  options: [
                    {
                      type: 'custom',
                      name: 'ErrorMessage',
                      generics: [
                        {
                          type: 'custom',
                          name: 'ObjectIssue',
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
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
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
        'undefined',
      ],
    },
  },
  schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
  keys: {
    type: {
      type: 'custom',
      name: 'TKey',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'SchemaWithPartial',
      href: '../SchemaWithPartial/',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
        {
          type: 'custom',
          name: 'TKeys',
        },
      ],
    },
  },
};
