import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TGetter: {
    modifier: 'extends',
    type: {
      type: 'function',
      params: [{ name: 'input', type: 'unknown' }],
      return: {
        type: 'custom',
        name: 'BaseSchema',
        href: '../../types/index/',
      },
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
          name: 'ReturnType',
          generics: [
            {
              type: 'custom',
              name: 'TGetter',
            },
          ],
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
              name: 'ReturnType',
              generics: [
                {
                  type: 'custom',
                  name: 'TGetter',
                },
              ],
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
      value: 'recursive',
    },
  },
  getter: {
    type: {
      type: 'custom',
      name: 'TGetter',
    },
  },
};
