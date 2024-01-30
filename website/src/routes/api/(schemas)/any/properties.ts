import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  pipe: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Pipe',
          href: '../Pipe/',
          generics: ['any'],
        },
        'undefined',
      ],
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'AnySchema',
      href: '../AnySchema/',
    },
  },
};
