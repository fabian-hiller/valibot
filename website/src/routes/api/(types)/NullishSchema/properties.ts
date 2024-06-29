import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TWrapped: {
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
  TDefault: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'Default',
      href: '../Default/',
      generics: [
        {
          type: 'custom',
          name: 'TWrapped',
        },
        {
          type: 'union',
          options: ['null', 'undefined'],
        },
      ],
    },
  },
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        {
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'InferInput',
              href: '../InferInput/',
              generics: [
                {
                  type: 'custom',
                  name: 'TWrapped',
                },
              ],
            },
            'null',
            'undefined',
          ],
        },
        {
          type: 'custom',
          name: 'InferNullishOutput',
          href: '../InferNullishOutput/',
          generics: [
            {
              type: 'custom',
              name: 'TWrapped',
            },
            {
              type: 'custom',
              name: 'TDefault',
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
              name: 'TWrapped',
            },
          ],
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'nullish',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'nullish',
      href: '../nullish/',
    },
  },
  expects: {
    type: {
      type: 'template',
      parts: [
        {
          type: 'custom',
          name: 'TWrapped',
          indexes: [
            {
              type: 'string',
              value: 'expects',
            },
          ],
        },
        {
          type: 'string',
          value: ' | null | undefined',
        },
      ],
    },
  },
  wrapped: {
    type: {
      type: 'custom',
      name: 'TWrapped',
    },
  },
  default: {
    type: {
      type: 'custom',
      name: 'TDefault',
    },
  },
};
