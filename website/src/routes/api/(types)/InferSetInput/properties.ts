import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TValue: {
    modifier: 'extends',
    type: {
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
  },
  InferSetInput: {
    type: {
      type: 'custom',
      name: 'Set',
      generics: [
        {
          type: 'custom',
          name: 'InferInput',
          href: '../InferInput/',
          generics: [
            {
              type: 'custom',
              name: 'TValue',
            },
          ],
        },
      ],
    },
  },
};
