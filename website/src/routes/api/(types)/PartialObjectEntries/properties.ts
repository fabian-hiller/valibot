import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TEntries: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ObjectEntries',
      href: '../ObjectEntries/',
    },
  },
  PartialObjectEntries: {
    type: {
      type: 'object',
      entries: [
        {
          key: {
            name: 'TKey',
            modifier: 'in keyof',
            type: { type: 'custom', name: 'TEntries' },
          },
          value: {
            type: 'custom',
            name: 'OptionalSchema',
            href: '../OptionalSchema/',
            generics: [
              {
                type: 'custom',
                name: 'TEntries',
                generics: [
                  {
                    type: 'custom',
                    name: 'TKey',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },
};
