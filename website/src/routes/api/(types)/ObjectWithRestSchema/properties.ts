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
  TRest: {
    modifier: 'extends',
    type: {
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
              name: 'ObjectWithRestIssue',
              href: '../ObjectWithRestIssue/',
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
                  value: {
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
                  value: {
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
          ],
        },
        {
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'ObjectWithRestIssue',
              href: '../ObjectWithRestIssue/',
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
      value: 'object_with_rest',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'objectWithRest',
      href: '../objectWithRest/',
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
