import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'PartialInput',
      href: '../PartialInput/',
    },
  },
  TPathList: {
    modifier: 'extends',
    type: {
      type: 'array',
      modifier: 'readonly',
      item: {
        type: 'custom',
        name: 'PathKeys',
        href: '../PathKeys/',
        generics: [
          {
            type: 'custom',
            name: 'TInput',
          },
        ],
      },
    },
  },
  TSelection: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'DeepPickN',
      href: '../DeepPickN/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'TPathList',
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
              name: 'PartialCheckIssue',
              href: '../PartialCheckIssue/',
              generics: [
                {
                  type: 'custom',
                  name: 'TSelection',
                },
              ],
            },
          ],
        },
        'undefined',
      ],
    },
  },
  pathList: {
    type: {
      type: 'custom',
      name: 'TPathList',
    },
  },
  requirement: {
    type: {
      type: 'function',
      params: [
        {
          name: 'input',
          type: {
            type: 'custom',
            name: 'TSelection',
          },
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
  Action: {
    type: {
      type: 'custom',
      name: 'PartialCheckActionAsync',
      href: '../PartialCheckActionAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'TSelection',
        },
        {
          type: 'custom',
          name: 'TMessage',
        },
      ],
    },
  },
};
