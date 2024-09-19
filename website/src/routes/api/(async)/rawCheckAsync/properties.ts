import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  action: {
    type: {
      type: 'function',
      params: [
        {
          name: 'context',
          type: {
            type: 'custom',
            name: 'Context',
            href: '../rawCheck/Context/',
            generics: [
              {
                type: 'custom',
                name: 'TInput',
              },
            ],
          },
        },
      ],
      return: {
        type: 'custom',
        name: 'MaybePromise',
        href: '../MaybePromise/',
        generics: ['void'],
      },
    },
  },
  Action: {
    type: {
      type: 'custom',
      name: 'RawCheckActionAsync',
      href: '../RawCheckActionAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
};
