import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  FallbackInfo: {
    type: 'object',
  },
  input: {
    type: 'unknown',
  },
  issues: {
    type: {
      type: 'custom',
      name: 'SchemaIssues',
      href: '../SchemaIssues/',
    },
  },
};
