import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TWrapped: {
    modifier: 'extends',
    type: {
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
        {
          type: 'union',
          options: ['null', 'undefined'],
        },
      ],
    },
  },
  wrapped: {
    type: {
      type: 'custom',
      name: 'TWrapped',
    },
  },
  default_: {
    type: {
      type: 'custom',
      name: 'TDefault',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'NullishSchema',
      href: '../NullishSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TWrapped',
        },
        {
          type: 'custom',
          name: 'TDefault',
        },
      ],
    },
  },
};
