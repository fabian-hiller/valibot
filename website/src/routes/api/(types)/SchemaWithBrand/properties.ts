import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
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
  },
  TName: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BrandName',
      href: '../BrandName/',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'Omit',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
        {
          type: 'string',
          value: '_types',
        },
      ],
    },
  },
  _types: {
    type: {
      type: 'union',
      options: [
        {
          type: 'object',
          entries: [
            {
              key: 'input',
              value: {
                type: 'custom',
                name: 'Input',
                href: '../Input/',
                generics: [
                  {
                    type: 'custom',
                    name: 'TSchema',
                  },
                ],
              },
            },
            {
              key: 'output',
              value: {
                type: 'intersect',
                options: [
                  {
                    type: 'custom',
                    name: 'Output',
                    href: '../Output/',
                    generics: [
                      {
                        type: 'custom',
                        name: 'TSchema',
                      },
                    ],
                  },
                  {
                    type: 'custom',
                    name: 'Brand',
                    href: '../Brand/',
                    generics: [
                      {
                        type: 'custom',
                        name: 'TName',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        'undefined',
      ],
    },
  },
};
