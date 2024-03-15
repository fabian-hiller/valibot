import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TWrapped: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
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
      name: 'NullableSchema',
      href: '../NullableSchema/',
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
