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
  Schema: {
    type: {
      type: 'custom',
      name: 'UnionSchemaAsync',
      href: '../UnionSchemaAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TOptions',
        },
        {
          type: 'custom',
          name: 'TMessage',
        },
      ],
    },
  },
};
