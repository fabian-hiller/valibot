import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TReplacer: {
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
        {
          type: 'array',
          item: {
            type: 'union',
            options: ['string', 'number'],
          },
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
              name: 'JsonStringifyIssue',
              href: '../JsonStringifyIssue/',
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
        'string',
        {
          type: 'custom',
          name: 'JsonStringifyIssue',
          href: '../JsonStringifyIssue/',
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
      value: 'json_stringify',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'jsonStringify',
      href: '../jsonStringify/',
    },
  },
  replacer: {
    type: {
      type: 'custom',
      name: 'TReplacer',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
