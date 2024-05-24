import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
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
  TName: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BrandName',
      href: '../BrandName/',
    },
  },
  schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
  name: {
    type: {
      type: 'custom',
      name: 'TName',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'SchemaWithBrand',
      href: '../SchemaWithBrand/',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
        {
          type: 'custom',
          name: 'TName',
        },
      ],
    },
  },
};
