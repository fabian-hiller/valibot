import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TKey: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
    },
  },
  TValue: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
    },
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
    default: {
      type: 'custom',
      name: 'MapOutput',
      href: '../MapOutput/',
      generics: [
        {
          type: 'custom',
          name: 'TKey',
        },
        {
          type: 'custom',
          name: 'TValue',
        },
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
          type: 'custom',
          name: 'MapInput',
          href: '../MapInput/',
          generics: [
            {
              type: 'custom',
              name: 'TKey',
            },
            {
              type: 'custom',
              name: 'TValue',
            },
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
      value: 'map',
    },
  },
  key: {
    type: {
      type: 'custom',
      name: 'TKey',
    },
  },
  value: {
    type: {
      type: 'custom',
      name: 'TValue',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'ErrorMessage',
      href: '../ErrorMessage/',
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
              type: 'custom',
              name: 'MapOutput',
              href: '../MapOutput/',
              generics: [
                {
                  type: 'custom',
                  name: 'TKey',
                },
                {
                  type: 'custom',
                  name: 'TValue',
                },
              ],
            },
          ],
        },
        'undefined',
      ],
    },
  },
};
