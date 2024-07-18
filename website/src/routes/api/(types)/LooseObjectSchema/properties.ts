import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TEntries: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ObjectEntries',
      href: '../ObjectEntries/',
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
              name: 'LooseObjectIssue',
              href: '../LooseObjectIssue/',
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
          type: 'intersect',
          options: [
            {
              type: 'custom',
              name: 'InferObjectInput',
              href: '../InferObjectInput/',
              generics: [
                {
                  type: 'custom',
                  name: 'TEntries',
                },
              ],
            },
            {
              type: 'object',
              entries: [
                {
                  key: {
                    name: 'key',
                    type: 'string',
                  },
                  value: 'unknown',
                },
              ],
            },
          ],
        },
        {
          type: 'intersect',
          options: [
            {
              type: 'custom',
              name: 'InferObjectOutput',
              href: '../InferObjectOutput/',
              generics: [
                {
                  type: 'custom',
                  name: 'TEntries',
                },
              ],
            },
            {
              type: 'object',
              entries: [
                {
                  key: {
                    name: 'key',
                    type: 'string',
                  },
                  value: 'unknown',
                },
              ],
            },
          ],
        },
        {
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'LooseObjectIssue',
              href: '../LooseObjectIssue/',
            },
            {
              type: 'custom',
              name: 'InferObjectIssue',
              href: '../InferObjectIssue/',
              generics: [
                {
                  type: 'custom',
                  name: 'TEntries',
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
      value: 'loose_object',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'looseObject',
      href: '../looseObject/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'Object',
    },
  },
  entries: {
    type: {
      type: 'custom',
      name: 'TEntries',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
