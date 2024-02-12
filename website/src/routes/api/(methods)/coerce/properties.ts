import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
    },
  },
  schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
  action: {
    type: {
      type: 'function',
      params: [{ name: 'input', type: 'unknown' }],
      return: 'unknown',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
};
