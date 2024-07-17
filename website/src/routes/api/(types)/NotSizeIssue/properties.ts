import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'SizeInput',
      href: '../SizeInput/',
    },
  },
  TRequirement: {
    modifier: 'extends',
    type: 'number',
  },
  BaseIssue: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseIssue',
      href: '../BaseIssue/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
  kind: {
    type: {
      type: 'string',
      value: 'validation',
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'not_size',
    },
  },
  expected: {
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
  received: {
    type: {
      type: 'template',
      parts: [
        {
          type: 'custom',
          name: 'TRequirement',
        },
      ],
    },
  },
  requirement: {
    type: {
      type: 'custom',
      name: 'TRequirement',
    },
  },
};
