import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TValue: {
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
  OutputDataset: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'SuccessDataset',
          href: '../SuccessDataset/',
          generics: [
            {
              type: 'custom',
              name: 'TValue',
            },
          ],
        },
        {
          type: 'custom',
          name: 'PartialDataset',
          href: '../PartialDataset/',
          generics: [
            {
              type: 'custom',
              name: 'TValue',
            },
            {
              type: 'custom',
              name: 'TIssue',
            },
          ],
        },
        {
          type: 'custom',
          name: 'FailureDataset',
          href: '../FailureDataset/',
          generics: [
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
