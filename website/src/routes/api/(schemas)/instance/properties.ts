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
  class_: {
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
  Schema: {
    type: {
      type: 'custom',
      name: 'InstanceSchema',
      href: '../InstanceSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TClass',
        },
        {
          type: 'custom',
          name: 'TMessage',
        },
      ],
    },
  },
};
