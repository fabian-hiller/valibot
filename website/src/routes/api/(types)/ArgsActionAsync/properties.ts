import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'function',
      params: [
        {
          spread: true,
          name: 'args',
          type: {
            type: 'array',
            item: 'any',
          },
        },
      ],
      return: 'unknown',
    },
  },
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'LooseTupleSchema',
          href: '../LooseTupleSchema/',
          generics: [
            {
              type: 'custom',
              name: 'TupleItems',
              href: '../TupleItems/',
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
                      name: 'LooseTupleIssue',
                      href: '../LooseTupleIssue/',
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
          name: 'LooseTupleSchemaAsync',
          href: '../LooseTupleSchemaAsync/',
          generics: [
            {
              type: 'custom',
              name: 'TupleItemsAsync',
              href: '../TupleItemsAsync/',
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
                      name: 'LooseTupleIssue',
                      href: '../LooseTupleIssue/',
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
          name: 'StrictTupleSchema',
          href: '../StrictTupleSchema/',
          generics: [
            {
              type: 'custom',
              name: 'TupleItems',
              href: '../TupleItems/',
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
                      name: 'StrictTupleIssue',
                      href: '../StrictTupleIssue/',
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
          name: 'StrictTupleSchemaAsync',
          href: '../StrictTupleSchemaAsync/',
          generics: [
            {
              type: 'custom',
              name: 'TupleItemsAsync',
              href: '../TupleItemsAsync/',
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
                      name: 'StrictTupleIssue',
                      href: '../StrictTupleIssue/',
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
          name: 'TupleSchema',
          href: '../TupleSchema/',
          generics: [
            {
              type: 'custom',
              name: 'TupleItems',
              href: '../TupleItems/',
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
                      name: 'TupleIssue',
                      href: '../TupleIssue/',
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
          name: 'TupleSchemaAsync',
          href: '../TupleSchemaAsync/',
          generics: [
            {
              type: 'custom',
              name: 'TupleItemsAsync',
              href: '../TupleItemsAsync/',
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
                      name: 'TupleIssue',
                      href: '../TupleIssue/',
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
          name: 'TupleWithRestSchema',
          href: '../TupleWithRestSchema/',
          generics: [
            {
              type: 'custom',
              name: 'TupleItems',
              href: '../TupleItems/',
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
                      name: 'TupleWithRestIssue',
                      href: '../TupleWithRestIssue/',
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
          name: 'TupleWithRestSchemaAsync',
          href: '../TupleWithRestSchemaAsync/',
          generics: [
            {
              type: 'custom',
              name: 'TupleItemsAsync',
              href: '../TupleItemsAsync/',
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
                      name: 'TupleWithRestIssue',
                      href: '../TupleWithRestIssue/',
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
  BaseTransformation: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseTransformation',
      href: '../BaseTransformation/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'function',
          params: [
            {
              spread: true,
              name: 'args',
              type: {
                type: 'custom',
                name: 'InferInput',
                href: '../InferInput/',
                generics: [
                  {
                    type: 'custom',
                    name: 'TSchema',
                  },
                ],
              },
            },
          ],
          return: {
            type: 'custom',
            name: 'Promise',
            generics: [
              {
                type: 'custom',
                name: 'Awaited',
                generics: [
                  {
                    type: 'custom',
                    name: 'ReturnType',
                    generics: [
                      {
                        type: 'custom',
                        name: 'TInput',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        'never',
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'args',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'argsAsync',
      href: '../argsAsync/',
    },
  },
  schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
};
