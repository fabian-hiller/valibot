import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TMessage: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ErrorMessage',
          href: '../ErrorMessage/',
          generics: [
            {
              type: 'custom',
              name: 'BlobIssue',
              href: '../BlobIssue/',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        {
          type: 'custom',
          name: 'Blob',
        },
        {
          type: 'custom',
          name: 'Blob',
        },
        {
          type: 'custom',
          name: 'BlobIssue',
          href: '../BlobIssue/',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'blob',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'blob',
      href: '../blob/',
    },
  },
  expects: {
    type: {
      type: 'string',
      value: 'Blob',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'BlobIssue',
    },
  },
};
