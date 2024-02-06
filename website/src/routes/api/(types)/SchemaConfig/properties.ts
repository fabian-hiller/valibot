import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  SchemaConfig: {
    type: 'object',
  },
  lang: {
    type: {
      type: 'union',
      options: ['string', 'undefined'],
    },
  },
  message: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ErrorMessage',
          href: '../ErrorMessage/',
        },
        'undefined',
      ],
    },
  },
  abortEarly: {
    type: {
      type: 'union',
      options: ['boolean', 'undefined'],
    },
  },
  abortPipeEarly: {
    type: {
      type: 'union',
      options: ['boolean', 'undefined'],
    },
  },
  skipPipe: {
    type: {
      type: 'union',
      options: ['boolean', 'undefined'],
    },
  },
};
