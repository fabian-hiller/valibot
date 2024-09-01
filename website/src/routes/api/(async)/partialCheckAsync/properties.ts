import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
<<<<<<< HEAD
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
=======
  TKey: {
>>>>>>> 7ff23862 (docs: document async apis)
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
<<<<<<< HEAD
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
=======
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
  TValue: {
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
      name: 'Default',
      href: '../Default/',
      generics: [
        {
          type: 'custom',
          name: 'TWrapped',
        },
>>>>>>> 7ff23862 (docs: document async apis)
        'undefined',
      ],
    },
  },
<<<<<<< HEAD
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
=======
  key: {
    type: {
      type: 'custom',
      name: 'TKey',
    },
  },
  value: {
    type: {
      type: 'custom',
      name: 'TValue',
>>>>>>> 7ff23862 (docs: document async apis)
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
<<<<<<< HEAD
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
=======
  Schema: {
    type: {
      type: 'custom',
      name: 'nullableAsync',
      href: '../nullableAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TWrapped',
        },
        {
          type: 'custom',
          name: 'TDefault',
>>>>>>> 7ff23862 (docs: document async apis)
        },
      ],
    },
  },
};
