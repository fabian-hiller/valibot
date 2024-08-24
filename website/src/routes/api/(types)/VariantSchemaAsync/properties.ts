import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TKey: {
    modifier: 'extends',
    type: 'string',
  },
  TOptions: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'VariantOptionsAsync',
      href: '../VariantOptionsAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TKey',
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
              name: 'VariantIssue',
              href: '../VariantIssue/',
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
          name: 'InferInput',
          href: '../InferInput/',
          generics: [
            {
              type: 'custom',
              name: 'TOptions',
              indexes: ['number'],
            },
          ],
        },
        {
          type: 'custom',
          name: 'InferOutput',
          href: '../InferOutput/',
          generics: [
            {
              type: 'custom',
              name: 'TOptions',
              indexes: ['number'],
            },
          ],
        },
        {
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'VariantIssue',
              href: '../VariantIssue/',
            },
            {
              type: 'custom',
              name: 'InferVariantIssue',
              href: '../InferVariantIssue/',
              generics: [
                {
                  type: 'custom',
                  name: 'TOptions',
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
      value: 'variant',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'variantAsync',
      href: '../variantAsync/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'Object',
    },
  },
  key: {
    type: {
      type: 'custom',
      name: 'TKey',
    },
  },
  options: {
    type: {
      type: 'custom',
      name: 'TOptions',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
