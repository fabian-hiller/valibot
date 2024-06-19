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
  Schema: {
    type: {
      type: 'custom',
      name: 'Omit',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
        {
          type: 'string',
          value: '_types',
        },
      ],
    },
  },
  _types: {
    type: {
      type: 'union',
      options: [
        {
          type: 'object',
          entries: [
            {
              key: 'input',
              value: {
                type: 'custom',
                name: 'Input',
                generics: [
                  {
                    type: 'custom',
                    name: 'TSchema',
                  },
                ],
              },
            },
            {
              key: 'output',
              value: {
                type: 'custom',
                name: 'TOutput',
              },
            },
          ],
        },
        'undefined',
      ],
    },
  },
};
