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
              name: 'JsonParseIssue',
              href: '../JsonParseIssue/',
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
          type: 'custom',
          name: 'unknown',
        },
        {
          type: 'custom',
          name: 'JsonParseIssue',
          href: '../JsonParseIssue/',
          generics: [
            {
              type: 'custom',
              name: 'TInput',
            },
          ],
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'json_parse',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'jsonParse',
      href: '../jsonParse/',
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
};
