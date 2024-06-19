import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
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
              name: 'UndefinedIssue',
              href: '../UndefinedIssue/',
            },
          ],
        },
        'undefined',
      ],
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
      name: 'UndefinedSchema',
      href: '../UndefinedSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TMessage',
        },
      ],
    },
  },
};
