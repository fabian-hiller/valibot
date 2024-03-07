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
    },
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
    default: {
      type: 'custom',
      name: 'Output',
      href: '../Output/',
      generics: [
        {
          type: 'custom',
          name: 'TOptions',
          indexes: ['number'],
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
          name: 'Input',
          href: '../Input/',
          generics: [
            {
              type: 'custom',
              name: 'TOptions',
              indexes: ['number'],
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
      value: 'variant',
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
};
