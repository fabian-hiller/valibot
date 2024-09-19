import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  dataset: {
    type: {
      type: 'custom',
      name: 'Dataset',
      href: '../../Dataset/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'BaseIssue',
          href: '../../BaseIssue/',
          generics: ['unknown'],
        },
      ],
    },
  },
  config: {
    type: {
      type: 'custom',
      name: 'Config',
      href: '../../Config/',
      generics: [
        {
          type: 'custom',
          name: 'RawCheckIssue',
          href: '../../RawCheckIssue/',
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
  addIssue: {
    type: {
      type: 'custom',
      name: 'AddIssue',
      href: '../AddIssue/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
};
