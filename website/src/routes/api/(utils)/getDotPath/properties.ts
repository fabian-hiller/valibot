import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TSchema: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
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
        {
          type: 'custom',
          name: 'BaseSchemaAsync',
          href: '../BaseSchemaAsync/',
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
      ],
    },
  },
  issue: {
    type: {
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
  },
  dotPath: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'IssueDotPath',
          href: '../IssueDotPath/',
          generics: [
            {
              type: 'custom',
              name: 'TSchema',
            },
          ],
        },
        'null',
      ],
    },
  },
};
