import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'BaseSchema',
          href: '../BaseSchema/',
        },
        {
          type: 'custom',
          name: 'BaseSchemaAsync',
          href: '../BaseSchemaAsync/',
        },
      ],
    },
  },
  SafeParseResult: {
    type: 'object',
  },
  typed: {
    type: 'boolean',
  },
  success: {
    type: 'boolean',
  },
  output: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Output',
          href: '../Output/',
          generics: [
            {
              type: 'custom',
              name: 'TSchema',
            },
          ],
        },
        'unknown',
      ],
    },
  },
  issues: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'SchemaIssues',
          href: '../SchemaIssues/',
        },
        'undefined',
      ],
    },
  },
};
