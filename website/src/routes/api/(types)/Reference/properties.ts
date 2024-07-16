import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  Reference: {
    type: {
      type: 'function',
      params: [
        {
          name: 'args',
          spread: true,
          type: {
            type: 'array',
            item: 'any',
          },
        },
      ],
      return: {
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
            name: 'BaseValidationAsync',
            href: '../BaseValidationAsync/',
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
            name: 'BaseTransformation',
            href: '../BaseTransformation/',
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
            name: 'BaseTransformationAsync',
            href: '../BaseTransformationAsync/',
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
  },
};
