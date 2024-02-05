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
  config: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Pick',
          generics: [
            {
              type: 'custom',
              name: 'SchemaConfig',
              href: '../SchemaConfig/',
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
