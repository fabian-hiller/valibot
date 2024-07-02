import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TOptions: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'UnionOptionsAsync',
      href: '../UnionOptionsAsync/',
    },
  },
  TMessage: {
    modifier: 'extends',
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
              name: 'UnionIssue',
              href: '../UnionIssue/',
              generics: [
                {
                  type: 'custom',
                  name: 'InferIssue',
                  href: '../InferIssue/',
                  generics: [
                    {
                      type: 'custom',
                      name: 'TOptions',
                      indexes: ['number'],
                    },
                  ],
                },
              ],
            },
          ],
        },
        'undefined',
      ],
    },
  },
  BaseSchemaAsync: {
    type: {
      type: 'custom',
      name: 'BaseSchemaAsync',
      href: '../BaseSchemaAsync/',
      generics: [
        {
          type: 'custom',
          name: 'InferInput',
          href: '../InferInput/',
          generics: [
            {
              type: 'custom',
              name: 'TOptions',
              indexes: ['number'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'InferOutput',
          href: '../InferOutput/',
          generics: [
            {
              type: 'custom',
              name: 'TOptions',
              indexes: ['number'],
            },
          ],
        },
        {
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'UnionIssue',
              href: '../UnionIssue/',
              generics: [
                {
                  type: 'custom',
                  name: 'InferIssue',
                  href: '../InferIssue/',
                  generics: [
                    {
                      type: 'custom',
                      name: 'TOptions',
                      indexes: ['number'],
                    },
                  ],
                },
              ],
            },
            {
              type: 'custom',
              name: 'InferIssue',
              href: '../InferIssue/',
              generics: [
                {
                  type: 'custom',
                  name: 'TOptions',
                  indexes: ['number'],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'union',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'unionAsync',
      href: '../unionAsync/',
    },
  },
  options: {
    type: {
      type: 'custom',
      name: 'TOptions',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
