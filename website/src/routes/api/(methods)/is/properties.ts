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
  input: {
    type: 'unknown',
  },
  info: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Pick',
          generics: [
            {
              type: 'custom',
              name: 'ParseInfo',
            },
            {
              type: 'string',
              value: 'skipPipe',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  result: {
    type: 'boolean',
  },
};
