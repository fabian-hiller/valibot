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
  Dataset: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'TypedDataset',
          href: '../TypedDataset/',
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
          name: 'UntypedDataset',
          href: '../UntypedDataset/',
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
