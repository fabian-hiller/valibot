import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TKey: {
    modifier: 'extends',
    type: 'string',
  },
  TOptions: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'VariantOptions',
      href: '../VariantOptions/',
      generics: [
        {
          type: 'custom',
          name: 'TKey',
        },
      ],
    },
  },
  key: {
    type: {
      type: 'custom',
      name: 'TKey',
    },
  },
  options: {
    type: {
      type: 'custom',
      name: 'TOptions',
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
              name: 'Output',
              href: '../Output/',
              generics: [
                {
                  type: 'custom',
                  name: 'TOptions',
                  href: '../TOptions/',
                  indexes: ['number'],
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
      name: 'VariantSchema',
      href: '../VariantSchema/',
    },
  },
};
