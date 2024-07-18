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
  PipeActionAsync: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'BaseValidationAsync',
          href: '../BaseValidationAsync/',
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
          name: 'BaseTransformationAsync',
          href: '../BaseTransformationAsync/',
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
      ],
    },
  },
};
