import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'NonNullableSchema',
          href: '../NonNullableSchema/',
          generics: [
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
                      name: 'NonNullableIssue',
                      href: '../NonNullableIssue/',
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
          name: 'NonNullableSchemaAsync',
          href: '../NonNullableSchemaAsync/',
          generics: [
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
                      name: 'NonNullableIssue',
                      href: '../NonNullableIssue/',
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
          name: 'NonNullishSchema',
          href: '../NonNullishSchema/',
          generics: [
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
                      name: 'NonNullishIssue',
                      href: '../NonNullishIssue/',
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
          name: 'NonNullishSchemaAsync',
          href: '../NonNullishSchemaAsync/',
          generics: [
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
                      name: 'NonNullishIssue',
                      href: '../NonNullishIssue/',
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
          name: 'NonOptionalSchema',
          href: '../NonOptionalSchema/',
          generics: [
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
                      name: 'NonOptionalIssue',
                      href: '../NonOptionalIssue/',
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
          name: 'NonOptionalSchemaAsync',
          href: '../NonOptionalSchemaAsync/',
          generics: [
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
                      name: 'NonOptionalIssue',
                      href: '../NonOptionalIssue/',
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
          name: 'NullableSchema',
          href: '../NullableSchema/',
          generics: [
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
            'unknown',
          ],
        },
        {
          type: 'custom',
          name: 'NullableSchemaAsync',
          href: '../NullableSchemaAsync/',
          generics: [
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
            'unknown',
          ],
        },
        {
          type: 'custom',
          name: 'NullishSchema',
          href: '../NullishSchema/',
          generics: [
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
            'unknown',
          ],
        },
        {
          type: 'custom',
          name: 'NullishSchemaAsync',
          href: '../NullishSchemaAsync/',
          generics: [
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
            'unknown',
          ],
        },
        {
          type: 'custom',
          name: 'OptionalSchema',
          href: '../OptionalSchema/',
          generics: [
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
            'unknown',
          ],
        },
        {
          type: 'custom',
          name: 'OptionalSchemaAsync',
          href: '../OptionalSchemaAsync/',
          generics: [
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
            'unknown',
          ],
        },
      ],
    },
  },
  schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
      indexes: [
        {
          type: 'string',
          value: 'wrapped',
        },
      ],
    },
  },
};
