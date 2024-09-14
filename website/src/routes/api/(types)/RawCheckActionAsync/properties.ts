import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  BaseValidationAsync: {
    modifier: 'extends',
    type: {
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
          name: 'TInput',
        },
        {
          type: 'custom',
          name: 'RawCheckIssue',
          href: '../RawCheckIssue/',
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
  type: {
    type: {
      type: 'string',
      value: 'raw_check',
    },
  },
  reference: {
    type: {
      type: 'custom',
      modifier: 'typeof',
      name: 'rawCheckAsync',
      href: '../rawCheckAsync/',
    },
  },
  expects: {
    type: 'null',
  },
};
