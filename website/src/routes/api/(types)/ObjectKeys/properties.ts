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
  },
  ObjectKeys: {
    type: {
      type: 'custom',
      name: 'MaybeReadonly',
      href: '../MaybeReadonly/',
      generics: [
        {
          type: 'tuple',
          items: [
            {
              type: 'custom',
              modifier: 'keyof',
              name: 'TSchema',
              indexes: [
                {
                  type: 'string',
                  value: 'entries',
                },
              ],
            },
            {
              type: 'array',
              spread: true,
              item: {
                type: 'custom',
                modifier: 'keyof',
                name: 'TSchema',
                indexes: [
                  {
                    type: 'string',
                    value: 'entries',
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  },
};
