import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TItem: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
    },
  },
  item: {
    type: {
      type: 'custom',
      name: 'TItem',
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
  pipe: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Pipe',
          href: '../Pipe/',
          generics: [
            {
              type: 'array',
              item: {
                type: 'custom',
                name: 'Output',
                href: '../Output/',
                generics: [
                  {
                    type: 'custom',
                    name: 'TItem',
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
  Schema: {
    type: {
      type: 'custom',
      name: 'ArraySchema',
      href: '../ArraySchema/',
      generics: [
        {
          type: 'custom',
          name: 'TItem',
        },
      ],
    },
  },
};
