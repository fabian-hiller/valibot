import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TWrapped: {
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
              name: 'NonNullableIssue',
              href: '../NonNullableIssue/',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  BaseSchemaAsync: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        {
          type: 'custom',
          name: 'InferNonNullableInput',
          href: '../InferNonNullableInput/',
          generics: [
            {
              type: 'custom',
              name: 'TWrapped',
            },
          ],
        },
        {
          type: 'custom',
          name: 'InferNonNullableOutput',
          href: '../InferNonNullableOutput/',
          generics: [
            {
              type: 'custom',
              name: 'TWrapped',
            },
          ],
        },
        {
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'NonNullableIssue',
              href: '../NonNullableIssue/',
            },
            {
              type: 'custom',
              name: 'InferNonNullishIssue',
              href: '../InferNonNullishIssue/',
              generics: [
                {
                  type: 'custom',
                  name: 'TWrapped',
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
      value: 'non_nullable',
    },
  },
  reference: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          modifier: 'typeof',
          name: 'nonNullable',
          href: '../nonNullable/',
        },
        {
          type: 'custom',
          modifier: 'typeof',
          name: 'nonNullableAsync',
          href: '../nonNullableAsync/',
        },
      ],
    },
  },
  expects: {
    type: {
      type: 'string',
      value: '!null',
    },
  },
  wrapped: {
    type: {
      type: 'custom',
      name: 'TWrapped',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
