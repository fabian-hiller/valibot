import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  pipe: {
    type: [
      {
        type: 'custom',
        name: 'Pipe',
        href: '../Pipe/',
        generics: ['unknown'],
      },
      'undefined',
    ],
  },
  Schema: {
    type: [
      {
        type: 'custom',
        name: 'UnknownSchema',
        href: '../UnknownSchema/',
      },
    ],
  },
};
