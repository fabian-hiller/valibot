import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TItem: {
    modifier: 'extends',
    type: {
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
              name: 'ArrayIssue',
              href: '../ArrayIssue/',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  BaseSchemaAsync: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchemaAsync',
      href: '../BaseSchemaAsync/',
      generics: [
        {
          type: 'array',
          item: {
            type: 'custom',
            name: 'InferInput',
            href: '../InferInput/',
            generics: [
              {
                type: 'custom',
                name: 'TItem',
              },
            ],
          },
        },
        {
          type: 'array',
          item: {
            type: 'custom',
            name: 'InferOutput',
            href: '../InferOutput/',
            generics: [
              {
                type: 'custom',
                name: 'TItem',
              },
            ],
          },
        },
        {
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'ArrayIssue',
              href: '../ArrayIssue/',
            },
            {
              type: 'custom',
              name: 'InferIssue',
              href: '../InferIssue/',
              generics: [
                {
                  type: 'custom',
                  name: 'TItem',
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
      value: 'array',
    },
  },
  reference: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          modifier: 'typeof',
          name: 'array',
          href: '../array/',
        },
        {
          type: 'custom',
          modifier: 'typeof',
          name: 'arrayAsync',
          href: '../arrayAsync/',
        },
      ],
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'Array',
    },
  },
  item: {
    type: {
      type: 'custom',
      name: 'TItem',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
