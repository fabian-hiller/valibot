import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  reason: {
    type: [
      { type: 'string', value: 'any' },
      { type: 'string', value: 'array' },
      { type: 'string', value: 'bigint' },
      { type: 'string', value: 'blob' },
      { type: 'string', value: 'boolean' },
      { type: 'string', value: 'date' },
      { type: 'string', value: 'function' },
      { type: 'string', value: 'instance' },
      { type: 'string', value: 'map' },
      { type: 'string', value: 'number' },
      { type: 'string', value: 'object' },
      { type: 'string', value: 'record' },
      { type: 'string', value: 'set' },
      { type: 'string', value: 'special' },
      { type: 'string', value: 'string' },
      { type: 'string', value: 'symbol' },
      { type: 'string', value: 'tuple' },
      { type: 'string', value: 'undefined' },
      { type: 'string', value: 'unknown' },
      { type: 'string', value: 'type' },
    ],
  },
};
