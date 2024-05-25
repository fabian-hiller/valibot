import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        'unknown',
        'unknown',
        {
          type: 'custom',
          name: 'BaseIssue',
          href: '../BaseIssue/',
          generics: ['unknown'],
        },
      ],
    },
  },
  TItems: {
    modifier: 'extends',
    type: {
      type: 'array',
      item: {
        type: 'custom',
        name: 'PipeItem',
        href: '../PipeItem/',
        generics: [
          'unknown',
          'unknown',
          {
            type: 'custom',
            name: 'BaseIssue',
            href: '../BaseIssue/',
            generics: ['unknown'],
          },
        ],
      },
    },
  },
  schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
  items: {
    type: {
      type: 'custom',
      name: 'TItems',
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'SchemaWithPipe',
      href: '../SchemaWithPipe/',
      generics: [
        {
          type: 'tuple',
          items: [
            {
              type: 'custom',
              name: 'TSchema',
            },
            {
              type: 'custom',
              spread: true,
              name: 'TItems',
            },
          ],
        },
      ],
    },
  },
};
