import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TWrapped: {
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
  TDefault: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'DefaultAsync',
      href: '../DefaultAsync/',
      generics: [
        {
          type: 'custom',
          name: 'TWrapped',
        },
        'undefined',
      ],
    },
  },
  InferOptionalOutput: {
    type: {
      type: 'conditional',
      conditions: [
        {
          type: {
            type: 'tuple',
            items: [
              {
                type: 'custom',
                name: 'TDefault',
              },
            ],
          },
          extends: {
            type: 'tuple',
            items: ['never'],
          },
          true: {
            type: 'union',
            options: [
              {
                type: 'custom',
                name: 'InferOutput',
                href: '../InferOutput/',
                generics: [
                  {
                    type: 'custom',
                    name: 'TWrapped',
                  },
                ],
              },
              'undefined',
            ],
          },
        },
      ],
      false: {
        type: 'union',
        options: [
          {
            type: 'custom',
            name: 'NonOptional',
            href: '../NonOptional/',
            generics: [
              {
                type: 'custom',
                name: 'InferOutput',
                href: '../InferOutput/',
                generics: [
                  {
                    type: 'custom',
                    name: 'TWrapped',
                  },
                ],
              },
            ],
          },
          {
            type: 'custom',
            name: 'Extract',
            generics: [
              {
                type: 'custom',
                name: 'DefaultValue',
                generics: [
                  {
                    type: 'custom',
                    name: 'TDefault',
                  },
                ],
              },
              'undefined',
            ],
          },
        ],
      },
    },
  },
};
