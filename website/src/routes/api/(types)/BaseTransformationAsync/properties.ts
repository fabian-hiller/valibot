import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
  },
  TIssue: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseIssue',
      href: '../BaseIssue/',
      generics: ['unknown'],
    },
  },
  kind: {
    type: {
      type: 'string',
      value: 'transformation',
    },
  },
  type: {
    type: 'string',
  },
  reference: {
    type: {
      type: 'function',
      params: [
        {
          name: 'args',
          spread: true,
          type: {
            type: 'array',
            item: 'any',
          },
        },
      ],
      return: {
        type: 'union',
        options: [
          {
            type: 'custom',
            name: 'BaseTransformation',
            href: '../BaseTransformation/',
            generics: [
              {
                type: 'custom',
                name: 'TInput',
              },
              {
                type: 'custom',
                name: 'TOutput',
              },
              {
                type: 'custom',
                name: 'TIssue',
              },
            ],
          },
          {
            type: 'custom',
            name: 'BaseTransformationAsync',
            generics: [
              {
                type: 'custom',
                name: 'TInput',
              },
              {
                type: 'custom',
                name: 'TOutput',
              },
              {
                type: 'custom',
                name: 'TIssue',
              },
            ],
          },
        ],
      },
    },
  },
  async: {
    type: {
      type: 'boolean',
      value: true,
    },
  },
  _run: {
    type: {
      type: 'function',
      params: [
        {
          name: 'dataset',
          type: {
            type: 'custom',
            name: 'TypedDataset',
            href: '../TypedDataset/',
            generics: [
              {
                type: 'custom',
                name: 'TInput',
              },
              'never',
            ],
          },
        },
        {
          name: 'config',
          type: {
            type: 'custom',
            name: 'Config',
            href: '../Config/',
            generics: [
              {
                type: 'custom',
                name: 'TIssue',
              },
            ],
          },
        },
      ],
      return: {
        type: 'custom',
        name: 'Promise',
        generics: [
          {
            type: 'custom',
            name: 'Dataset',
            href: '../Dataset/',
            generics: [
              {
                type: 'custom',
                name: 'TOutput',
              },
              {
                type: 'custom',
                name: 'TIssue',
              },
            ],
          },
        ],
      },
    },
  },
  _types: {
    type: {
      type: 'union',
      options: [
        {
          type: 'object',
          entries: [
            {
              key: 'input',
              value: {
                type: 'custom',
                name: 'TInput',
              },
            },
            {
              key: 'output',
              value: {
                type: 'custom',
                name: 'TOutput',
              },
            },
            {
              key: 'issue',
              value: {
                type: 'custom',
                name: 'TIssue',
              },
            },
          ],
        },
        'undefined',
      ],
    },
  },
};
