import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TType: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'TObject',
      indexes: [{ type: 'string', value: 'type' }],
    },
  },
  TObject: {
    modifier: 'extends',
    type: {
      type: 'object',
      entries: [{ key: 'type', value: 'string' }],
    },
  },
  type: {
    type: {
      type: 'custom',
      name: 'TType',
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
