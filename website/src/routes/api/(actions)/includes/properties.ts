import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ContentInput',
      href: '../ContentInput/',
    },
  },
  TRequirement: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ContentRequirement',
      href: '../ContentRequirement/',
      generics: [
        {
          type: 'custom',
          name: 'ContentInput',
          href: '../ContentInput/',
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
              name: 'IncludesIssue',
              href: '../IncludesIssue/',
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
  Action: {
    type: {
      type: 'custom',
      name: 'IncludesAction',
      href: '../IncludesAction/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'TRequirement',
        },
        {
          type: 'custom',
          name: 'TMessage',
        },
      ],
    },
  },
};
