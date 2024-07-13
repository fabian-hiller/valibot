import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
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
              name: 'CustomIssue',
              href: '../CustomIssue/',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  BaseSchemaAsync: {
    type: {
      modifier: 'extends',
      type: 'custom',
      name: 'BaseSchemaAsync',
      href: '../BaseSchemaAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'CustomIssue',
          href: '../CustomIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'custom',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'customAsync',
      href: '../customAsync/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'unknown',
    },
  },
  check: {
    type: {
      type: 'function',
      params: [
        {
          name: 'input',
          type: 'unknown',
        },
      ],
      return: {
        type: 'custom',
        name: 'MaybePromise',
        href: '../MaybePromise/',
        generics: ['boolean'],
      },
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
