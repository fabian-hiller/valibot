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
              name: 'PromiseIssue',
              href: '../PromiseIssue/',
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
          name: 'Promise',
          generics: ['unknown'],
        },
        {
          type: 'custom',
          name: 'Promise',
          generics: ['unknown'],
        },
        {
          type: 'custom',
          name: 'PromiseIssue',
          href: '../PromiseIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'promise',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'promise',
      href: '../promise/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'Promise',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'TMessage',
    },
  },
};
