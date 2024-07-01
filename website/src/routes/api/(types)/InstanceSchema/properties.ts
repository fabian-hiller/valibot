import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TClass: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'Class',
      href: '../Class/',
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
              name: 'InstanceIssue',
              href: '../InstanceIssue/',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  BaseSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        {
          type: 'custom',
          name: 'InstanceType',
          generics: [
            {
              type: 'custom',
              name: 'TClass',
            },
          ],
        },
        {
          type: 'custom',
          name: 'InstanceType',
          generics: [
            {
              type: 'custom',
              name: 'TClass',
            },
          ],
        },
        {
          type: 'custom',
          name: 'InstanceIssue',
          href: '../InstanceIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'instance',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'instance',
      href: '../instance/',
    },
  },
  class: {
    type: {
      type: 'custom',
      name: 'TClass',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
