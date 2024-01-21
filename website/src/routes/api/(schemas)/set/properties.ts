import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TValue: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
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
    default: {
      type: 'string',
      value: 'Invalid type',
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
              name: 'SetOutput',
              href: '../SetOutput/',
              generics: [
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
      name: 'SetSchema',
      href: '../SetSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TValue',
        },
      ],
    },
  },
};
