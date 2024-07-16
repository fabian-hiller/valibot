import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
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
              name: 'FunctionIssue',
              href: '../FunctionIssue/',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  BaseSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        {
          type: 'function',
          params: [
            {
              name: 'args',
              spread: true,
              type: {
                type: 'array',
                item: 'unknown',
              },
            },
          ],
          return: 'unknown',
        },
        {
          type: 'function',
          params: [
            {
              name: 'args',
              spread: true,
              type: {
                type: 'array',
                item: 'unknown',
              },
            },
          ],
          return: 'unknown',
        },
        {
          type: 'custom',
          name: 'FunctionIssue',
          href: '../FunctionIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'function',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'function',
      href: '../function/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'Function',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
