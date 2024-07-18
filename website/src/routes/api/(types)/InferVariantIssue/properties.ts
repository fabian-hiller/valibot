import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TOptions: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'VariantOptions',
          href: '../VariantOptions/',
          generics: ['string'],
        },
        {
          type: 'custom',
          name: 'VariantOptionsAsync',
          href: '../VariantOptionsAsync/',
          generics: ['string'],
        },
      ],
    },
  },
  InferVariantIssue: {
    type: {
      type: 'custom',
      name: 'Exclude',
      generics: [
        {
          type: 'custom',
          name: 'InferIssue',
          href: '../InferIssue/',
          generics: [
            {
              type: 'custom',
              name: 'TOptions',
              indexes: ['number'],
            },
          ],
        },
        {
          type: 'object',
          entries: [
            {
              key: 'type',
              value: {
                type: 'union',
                options: [
                  {
                    type: 'string',
                    value: 'loose_object',
                  },
                  {
                    type: 'string',
                    value: 'object',
                  },
                  {
                    type: 'string',
                    value: 'object_with_rest',
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  },
};
