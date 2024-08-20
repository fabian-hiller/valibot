import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TItem: {
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
        {
          type: 'custom',
          name: 'BaseValidation',
          href: '../BaseValidation/',
          generics: [
            'any',
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
          name: 'BaseValidationAsync',
          href: '../BaseValidationAsync/',
          generics: [
            'any',
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
          name: 'BaseTransformation',
          href: '../BaseTransformation/',
          generics: [
            'any',
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
          name: 'BaseTransformationAsync',
          href: '../BaseTransformationAsync/',
          generics: [
            'any',
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
          name: 'BaseMetadata',
          href: '../BaseMetadata/',
          generics: ['any'],
        },
      ],
    },
  },
  InferInput: {
    type: {
      type: 'custom',
      name: 'NonNullable',
      generics: [
        {
          type: 'custom',
          name: 'TItem',
          indexes: [
            {
              type: 'string',
              value: '_types',
            },
          ],
        },
      ],
      indexes: [
        {
          type: 'string',
          value: 'input',
        },
      ],
    },
  },
};
