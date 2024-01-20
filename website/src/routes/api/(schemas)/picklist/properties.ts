import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TOptions: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'PicklistOptions',
      href: '../PicklistOptions/',
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
  Schema: {
    type: {
      type: 'custom',
      name: 'PicklistSchema',
      href: '../PicklistSchema/',
    },
  },
};
