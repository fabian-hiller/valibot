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
  schema: {
    type: {
      type: 'custom',
      name: 'TSchema',
    },
  },
  input: {
    type: 'unknown',
  },
  config: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Omit',
          generics: [
            {
              type: 'custom',
              name: 'Config',
              href: '../Config/',
              generics: [
                {
                  type: 'custom',
                  name: 'InferIssue',
                  href: '../InferIssue/',
                  generics: [
                    {
                      type: 'custom',
                      name: 'TSchema',
                    },
                  ],
                },
              ],
            },
            {
              type: 'string',
              value: 'skipPipe',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  output: {
    type: {
      type: 'custom',
      name: 'InferOutput',
      href: '../InferOutput/',
      generics: [
        {
          type: 'custom',
          name: 'TSchema',
        },
      ],
    },
  },
};
