import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'string',
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
              name: 'UlidIssue',
              href: '../UlidIssue/',
              generics: [
                {
                  type: 'custom',
                  name: 'TInput',
                  href: '../TInput/',
                },
              ],
            },
          ],
        },
        'undefined',
      ],
    },
  },
  BaseValidation: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseValidation',
      href: '../BaseValidation/',
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
          name: 'UlidIssue',
          href: '../UlidIssue/',
          generics: [
            {
              type: 'custom',
              name: 'TInput',
              href: '../TInput/',
            },
          ],
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'ulid',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'ulid',
      href: '../ulid/',
    },
  },
  expects: {
    type: 'null',
  },
  requirement: {
    type: {
      type: 'custom',
      name: 'RegExp',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
