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
              name: 'StrictTupleIssue',
              href: '../StrictTupleIssue/',
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
          type: 'custom',
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
          type: 'custom',
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
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'StrictTupleIssue',
              href: '../StrictTupleIssue/',
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
      value: 'strict_tuple',
    },
  },
  reference: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          modifier: 'typeof',
          name: 'strictTuple',
          href: '../strictTuple/',
        },
        {
          type: 'custom',
          modifier: 'typeof',
          name: 'strictTupleAsync',
          href: '../strictTupleAsync/',
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
