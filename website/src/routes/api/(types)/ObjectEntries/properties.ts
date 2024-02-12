import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  ObjectEntries: {
    type: {
      type: 'custom',
      name: 'Record',
      generics: [
        'string',
        {
          type: 'custom',
          name: 'BaseSchema',
          href: '../BaseSchema/',
        },
      ],
    },
  },
};
