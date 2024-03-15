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
  MapInput: {
    type: {
      type: 'custom',
      name: 'Map',
      generics: [
        {
          type: 'custom',
          name: 'Input',
          href: '../Input/',
          generics: [
            {
              type: 'custom',
              name: 'TKey',
            },
          ],
        },
        {
          type: 'custom',
          name: 'Input',
          href: '../Input/',
          generics: [
            {
              type: 'custom',
              name: 'TValue',
            },
          ],
        },
      ],
    },
  },
};
