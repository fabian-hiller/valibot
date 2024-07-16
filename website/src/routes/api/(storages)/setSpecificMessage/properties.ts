import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TReference: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'Reference',
      href: '../Reference/',
    },
  },
  reference: {
    type: {
      type: 'custom',
      name: 'TReference',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'ErrorMessage',
      href: '../ErrorMessage/',
      generics: [
        {
          type: 'custom',
          name: 'InferIssue',
          href: '../InferIssue/',
          generics: [
            {
              type: 'custom',
              name: 'ReturnType',
              generics: [
                {
                  type: 'custom',
                  name: 'TReference',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  lang: {
    type: {
      type: 'union',
      options: ['string', 'undefined'],
    },
  },
};
