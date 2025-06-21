import type { PropertyProps } from '~/components';

const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: ['bigint', 'boolean', 'number', 'string'],
    },
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
      value: 'transformation',
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'to_bigint',
    },
  },
  expected: {
    type: 'null',
  },
};

export default properties;
