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
              name: 'NumberIssue',
              href: '../NumberIssue/',
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
        'number',
        'number',
        {
          type: 'custom',
          name: 'NumberIssue',
          href: '../NumberIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'number',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'number',
      href: '../number/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'number',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
