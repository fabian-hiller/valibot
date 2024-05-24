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
  TMessage: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ErrorMessage',
          href: '../ErrorMessage/',
          generics: [
            {
              type: 'custom',
              name: 'PicklistIssue',
              href: '../PicklistIssue/',
            },
          ],
        },
        'undefined',
      ],
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
      type: 'custom',
      name: 'TMessage',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'PicklistSchema',
      href: '../PicklistSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TOptions',
        },
        {
          type: 'custom',
          name: 'TMessage',
        },
      ],
    },
  },
};
