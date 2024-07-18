import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  GlobalConfig: {
    type: {
      type: 'custom',
      name: 'Omit',
      generics: [
        {
          type: 'custom',
          name: 'Config',
          href: '../Config/',
          generics: ['never'],
        },
        {
          type: 'string',
          value: 'message',
        },
      ],
    },
  },
};
