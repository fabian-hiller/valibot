import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TOptions: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'IntersectOptions',
      href: '../IntersectOptions/',
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
              name: 'IntersectIssue',
              href: '../IntersectIssue/',
            },
          ],
        },
        'undefined',
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
          type: 'custom',
          name: 'InferIntersectInput',
          href: '../InferIntersectInput/',
          generics: [
            {
              type: 'custom',
              name: 'TOptions',
            },
          ],
        },
        {
          type: 'custom',
          name: 'InferIntersectOutput',
          href: '../InferIntersectOutput/',
          generics: [
            {
              type: 'custom',
              name: 'TOptions',
            },
          ],
        },
        {
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'IntersectIssue',
              href: '../IntersectIssue/',
            },
            {
              type: 'custom',
              name: 'InferIssue',
              href: '../InferIssue/',
              generics: [
                {
                  type: 'custom',
                  name: 'TOptions',
                  indexes: ['number'],
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
      value: 'intersect',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'intersect',
      href: '../intersect/',
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
