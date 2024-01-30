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
  TOutput: {
    modifier: 'extends',
    type: 'any',
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
      ],
    },
  },
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
          ],
        },
        {
          type: 'custom',
          name: 'TOutput',
        },
      ],
    },
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
