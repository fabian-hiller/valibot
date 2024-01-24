import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  PipeAsync: {
    type: {
      type: 'array',
      item: {
        type: 'union',
        options: [
          {
            type: 'custom',
            name: 'BaseValidation',
            href: '../BaseValidation/',
            generics: [
              {
                type: 'custom',
                name: 'TInput',
              },
            ],
          },
          {
            type: 'custom',
            name: 'BaseValidationAsync',
            href: '../BaseValidationAsync/',
            generics: [
              {
                type: 'custom',
                name: 'TInput',
              },
            ],
          },
          {
            type: 'custom',
            name: 'BaseTransformation',
            href: '../BaseTransformation/',
            generics: [
              {
                type: 'custom',
                name: 'TInput',
              },
            ],
          },
          {
            type: 'custom',
            name: 'BaseTransformationAsync',
            href: '../BaseTransformationAsync/',
            generics: [
              {
                type: 'custom',
                name: 'TInput',
              },
            ],
          },
        ],
      },
    },
  },
};
