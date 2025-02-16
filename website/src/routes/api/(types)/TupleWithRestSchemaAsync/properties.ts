import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TItems: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'TupleItemsAsync',
      href: '../TupleItemsAsync/',
    },
  },
  TRest: {
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
              name: 'TupleWithRestIssue',
              href: '../TupleWithRestIssue/',
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
          type: 'tuple',
          items: [
            {
              type: 'custom',
              spread: true,
              name: 'InferTupleInput',
              href: '../InferTupleInput/',
              generics: [
                {
                  type: 'custom',
                  name: 'TItems',
                },
              ],
            },
            {
              type: 'array',
              spread: true,
              item: {
                type: 'custom',
                name: 'InferInput',
                href: '../InferInput/',
                generics: [
                  {
                    type: 'custom',
                    name: 'TRest',
                  },
                ],
              },
            },
          ],
        },
        {
          type: 'tuple',
          items: [
            {
              type: 'custom',
              spread: true,
              name: 'InferTupleOutput',
              href: '../InferTupleOutput/',
              generics: [
                {
                  type: 'custom',
                  name: 'TItems',
                },
              ],
            },
            {
              type: 'array',
              spread: true,
              item: {
                type: 'custom',
                name: 'InferOutput',
                href: '../InferOutput/',
                generics: [
                  {
                    type: 'custom',
                    name: 'TRest',
                  },
                ],
              },
            },
          ],
        },
        {
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'TupleWithRestIssue',
              href: '../TupleWithRestIssue/',
            },
            {
              type: 'custom',
              name: 'InferTupleIssue',
              href: '../InferTupleIssue/',
              generics: [
                {
                  type: 'custom',
                  name: 'TItems',
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
                  name: 'TRest',
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
      value: 'tuple_with_rest',
    },
  },
  reference: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          modifier: 'typeof',
          name: 'tupleWithRest',
          href: '../tupleWithRest/',
        },
        {
          type: 'custom',
          modifier: 'typeof',
          name: 'tupleWithRestAsync',
          href: '../tupleWithRestAsync/',
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
  items: {
    type: {
      type: 'custom',
      name: 'TItems',
    },
  },
  rest: {
    type: {
      type: 'custom',
      name: 'TRest',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
