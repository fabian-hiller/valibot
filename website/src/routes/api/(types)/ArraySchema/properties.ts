import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TItem: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        'unknown',
        'unknown',
        {
          type: 'custom',
          name: 'BaseIssue',
          href: '../BaseIssue/',
          generics: ['unknown'],
        },
      ],
    },
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
    default: {
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
  },
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        {
          type: 'array',
          item: {
            type: 'custom',
            name: 'Input',
            href: '../Input/',
            generics: [
              {
                type: 'custom',
                name: 'TItem',
              },
            ],
          },
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
      value: 'array',
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
};
