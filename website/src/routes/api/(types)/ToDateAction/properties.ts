import type { PropertyProps } from '~/components';

const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  BaseTransformation: {
    modifier: 'extends',
    type: {
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
          name: 'Date',
        },
        'never',
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'to_date',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'toDate',
      href: '../toDate/',
    },
  },
};

export default properties;
