import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  ObjectEntriesAsync: {
    type: {
      type: 'custom',
      name: 'Record',
      generics: [
        'string',
        {
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'BaseSchema',
              href: '../BaseSchema/',
            },
            {
              type: 'custom',
              name: 'BaseSchemaAsync',
              href: '../BaseSchemaAsync/',
            },
          ],
        },
      ],
    },
  },
};
