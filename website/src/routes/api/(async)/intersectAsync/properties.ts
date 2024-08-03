import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TOptions: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'IntersectOptionsAsync',
      href: '../IntersectOptionsAsync/',
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
              name: 'IntersectIssue',
              href: '../IntersectIssue/',
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
      name: 'IntersectSchemaAsync',
      href: '../IntersectSchemaAsync/',
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
