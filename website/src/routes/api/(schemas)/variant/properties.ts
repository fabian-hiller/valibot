import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TKey: {
    modifier: 'extends',
    type: 'string',
  },
  TOptions: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'VariantOptions',
      href: '../VariantOptions/',
      generics: [
        {
          type: 'custom',
          name: 'TKey',
        },
      ],
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
              name: 'VariantIssue',
              href: '../VariantIssue/',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  key: {
    type: {
      type: 'custom',
      name: 'TKey',
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
      name: 'VariantSchema',
      href: '../VariantSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TKey',
        },
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
