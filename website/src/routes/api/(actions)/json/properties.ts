import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'string',
  },
  TReviver: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'function',
          params: [
            {
              name: 'this',
              type: 'any',
            },
            {
              name: 'key',
              type: 'string',
            },
            {
              name: 'value',
              type: 'any',
            },
          ],
          return: 'any',
        },
        'undefined',
      ],
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
              name: 'JsonIssue',
              href: '../JsonIssue/',
              generics: [
                {
                  type: 'custom',
                  name: 'TInput',
                },
              ],
            },
          ],
        },
        'undefined',
      ],
    },
  },
  reviver: {
    type: {
      type: 'custom',
      name: 'TReviver',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
  Action: {
    type: {
      type: 'custom',
      name: 'JsonAction',
      href: '../JsonAction/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'TReviver',
        },
        {
          type: 'custom',
          name: 'TMessage',
        },
      ],
    },
  },
};
