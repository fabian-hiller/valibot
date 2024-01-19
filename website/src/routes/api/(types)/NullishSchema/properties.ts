import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        {
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'Input',
              href: '../Input/',
              generics: [
                {
                  type: 'custom',
                  name: 'TWrapped',
                },
              ],
            },
            'null',
            'undefined',
          ],
        },
        {
          type: 'custom',
          name: 'TOutput',
          default: {
            type: 'union',
            options: [
              {
                type: 'custom',
                name: 'Output',
                href: '../Output/',
                generics: [
                  {
                    type: 'custom',
                    name: 'TWrapped',
                  },
                ],
              },
              'null',
              'undefined',
            ],
          },
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'nullish',
    },
  },
  wrapped: {
    type: {
      type: 'custom',
      name: 'TWrapped',
    },
  },
  default: {
    type: {
      type: 'custom',
      name: 'TDefault',
    },
  },
};
