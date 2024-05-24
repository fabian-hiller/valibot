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
  TOutput: {
    modifier: 'extends',
    type: 'any',
  },
  schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
  action: {
    type: {
      type: 'function',
      params: [
        {
          name: 'input',
          type: {
            type: 'custom',
            name: 'Output',
            href: '../Output/',
            generics: [
              {
                type: 'custom',
                name: 'TSchema',
              },
            ],
          },
        },
        {
          name: 'info',
          type: {
            type: 'custom',
            name: 'TransformInfo',
            href: '../TransformInfo/',
          },
        },
      ],
      return: {
        type: 'custom',
        name: 'TOutput',
      },
    },
  },
  pipe: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Pipe',
          href: '../Pipe/',
          generics: [
            {
              type: 'custom',
              name: 'TOutput',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  validation: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'BaseSchema',
          href: '../BaseSchema/',
          generics: [
            {
              type: 'custom',
              name: 'TOutput',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'SchemaWithTransform',
      href: '../SchemaWithTransform/',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
        {
          type: 'custom',
          name: 'TOutput',
        },
      ],
    },
  },
};
