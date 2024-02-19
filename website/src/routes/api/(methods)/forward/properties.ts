import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'union',
      options: [
        {
          type: 'array',
          item: 'unknown',
        },
        {
          type: 'custom',
          name: 'Record',
          generics: ['unknown'],
        },
      ],
    },
  },
  validation: {
    type: {
      type: 'custom',
      name: 'BaseValidation',
      href: '../BaseValidation/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
  pathList: {
    type: {
      type: 'custom',
      name: 'PathList',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
  Validation: {
    type: {
      type: 'custom',
      name: 'BaseValidation',
      href: '../BaseValidation/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
};
