import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
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
  },
  TMessage: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ErrorMessage',
          href: '../ErrorMessage/',
          generics: [
            {
              type: 'custom',
              name: 'PicklistIssue',
              href: '../PicklistIssue/',
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
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'PicklistSchema',
      href: '../PicklistSchema/',
      generics: [
        {
          type: 'custom',
          name: 'ObjectKeys',
          generics: [
            {
              type: 'custom',
              name: 'TSchema',
            },
            {
              type: 'custom',
              name: 'TMessage',
            },
          ],
        },
      ],
    },
  },
};
