import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TKind: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'TObject',
      indexes: [{ type: 'string', value: 'kind' }],
    },
  },
  TObject: {
    modifier: 'extends',
    type: {
      type: 'object',
      entries: [{ key: 'kind', value: 'string' }],
    },
  },
  kind: {
    type: {
      type: 'custom',
      name: 'TKind',
    },
  },
  object: {
    type: {
      type: 'custom',
      name: 'TObject',
    },
  },
  result: {
    type: 'boolean',
  },
};
