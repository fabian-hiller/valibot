import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseIssue: {
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
      value: 'schema',
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'non_nullish',
    },
  },
  expected: {
    type: {
      type: 'string',
      value: '!null & !undefined',
    },
  },
};
