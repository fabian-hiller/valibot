import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  ObjectSchemas: {
    type: {
      type: 'tuple',
      items: [
        {
          type: 'custom',
          name: 'ObjectSchema',
          href: '../ObjectSchema/',
          generics: ['any', 'any'],
        },
        {
          type: 'custom',
          name: 'ObjectSchema',
          href: '../ObjectSchema/',
          generics: ['any', 'any'],
        },
        {
          type: 'array',
          spread: true,
          item: {
            type: 'custom',
            name: 'ObjectSchema',
            href: '../ObjectSchema/',
            generics: ['any', 'any'],
          },
        },
      ],
    },
  },
};
