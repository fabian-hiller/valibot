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
  Default: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
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
        {
          type: 'function',
          params: [],
          return: {
            type: 'union',
            options: [
              {
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
              'undefined',
            ],
          },
        },
        'undefined',
      ],
    },
  },
};
