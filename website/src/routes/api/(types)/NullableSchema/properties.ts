import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: [
      {
        type: 'custom',
        name: 'BaseSchema',
        href: '../BaseSchema/',
        generics: [
          [
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
          ],
          {
            type: 'custom',
            name: 'TOutput',
            default: [
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
            ],
          },
        ],
      },
    ],
  },
  type: {
    type: {
      type: 'string',
      value: 'nullable',
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
