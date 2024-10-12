import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'string',
  },
  TLocales: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'Intl.LocalesArgument',
    },
  },
  TRequirement: {
    modifier: 'extends',
    type: 'number',
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
              name: 'NotWordsIssue',
              href: '../NotWordsIssue/',
              generics: [
                {
                  type: 'custom',
                  name: 'TInput',
                },
                {
                  type: 'custom',
                  name: 'TRequirement',
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
          name: 'NotWordsIssue',
          href: '../NotWordsIssue/',
          generics: [
            {
              type: 'custom',
              name: 'TInput',
            },
            {
              type: 'custom',
              name: 'TRequirement',
            },
          ],
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'not_words',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'notWords',
      href: '../notWords/',
    },
  },
  expects: {
    type: {
      type: 'template',
      parts: [
        {
          type: 'string',
          value: '!',
        },
        {
          type: 'custom',
          name: 'TRequirement',
        },
      ],
    },
  },
  locales: {
    type: {
      type: 'custom',
      name: 'TLocales',
    },
  },
  requirement: {
    type: {
      type: 'custom',
      name: 'TRequirement',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
