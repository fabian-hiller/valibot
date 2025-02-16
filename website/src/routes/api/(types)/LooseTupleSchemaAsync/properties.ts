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
              name: 'LooseTupleIssue',
              href: '../LooseTupleIssue/',
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
              item: 'unknown',
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
              item: 'unknown',
            },
          ],
        },
        {
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'LooseTupleIssue',
              href: '../LooseTupleIssue/',
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
          ],
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'loose_tuple',
    },
  },
  reference: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          modifier: 'typeof',
          name: 'looseTuple',
          href: '../looseTuple/',
        },
        {
          type: 'custom',
          modifier: 'typeof',
          name: 'looseTupleAsync',
          href: '../looseTupleAsync/',
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
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
