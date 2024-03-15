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
  Schema: {
    type: {
      type: 'custom',
      name: 'MapSchema',
      href: '../MapSchema/',
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
};
