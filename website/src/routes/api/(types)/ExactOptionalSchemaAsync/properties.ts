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
  TDefault: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'DefaultAsync',
      href: '../DefaultAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TWrapped',
        },
        'undefined',
      ],
    },
  },
  BaseSchemaAsync: {
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
              name: 'TWrapped',
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
              name: 'TWrapped',
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
      value: 'exact_optional',
    },
  },
  reference: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          modifier: 'typeof',
          name: 'exactOptional',
          href: '../exactOptional/',
        },
        {
          type: 'custom',
          modifier: 'typeof',
          name: 'exactOptionalAsync',
          href: '../exactOptionalAsync/',
        },
      ],
    },
  },
  expects: {
    type: {
      type: 'template',
      parts: [
        {
          type: 'string',
          value: '(',
        },
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
          value: ' | undefined)',
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
