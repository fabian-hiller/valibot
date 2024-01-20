import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TWrapped: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
    },
  },
  TDefault: {
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
              name: 'TWrapped',
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
                    name: 'TWrapped',
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
  wrapped: {
    type: {
      type: 'custom',
      name: 'TWrapped',
    },
  },
  default_: {
    type: {
      type: 'custom',
      name: 'TDefault',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'OptionalSchema',
      href: '../OptionalSchema/',
    },
  },
};
