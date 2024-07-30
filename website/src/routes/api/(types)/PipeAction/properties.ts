import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
  },
  TIssue: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseIssue',
      href: '../BaseIssue/',
      generics: ['unknown'],
    },
  },
  PipeAction: {
    type: {
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
            {
              type: 'custom',
              name: 'TOutput',
            },
            {
              type: 'custom',
              name: 'TIssue',
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
            {
              type: 'custom',
              name: 'TOutput',
            },
            {
              type: 'custom',
              name: 'TIssue',
            },
          ],
        },
        {
          type: 'custom',
          name: 'BaseMetadata',
          href: '../BaseMetadata/',
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
};
