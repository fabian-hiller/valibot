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
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TOptions',
          indexes: ['number'],
        },
        {
          type: 'custom',
          name: 'TOptions',
          indexes: ['number'],
        },
        {
          type: 'custom',
          name: 'PicklistIssue',
          href: '../PicklistIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'picklist',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'picklist',
      href: '../picklist/',
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
};
