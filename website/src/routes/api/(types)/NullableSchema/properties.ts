import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TWrapped: {
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
  TDefault: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'Default',
      href: '../Default/',
      generics: [
        {
          type: 'custom',
          name: 'TWrapped',
        },
      ],
    },
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
    default: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Output',
          href: '../Output/',
          generics: [
            {
              type: 'custom',
              name: 'TWrapped',
            },
          ],
        },
        'null',
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
          type: 'union',
          options: [
            {
              type: 'custom',
              name: 'Input',
              href: '../Input/',
              generics: [
                {
                  type: 'custom',
                  name: 'TWrapped',
                },
              ],
            },
            'null',
          ],
        },
        {
          type: 'custom',
          name: 'TOutput',
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'nullable',
    },
  },
  wrapped: {
    type: {
      type: 'custom',
      name: 'TWrapped',
    },
  },
  default: {
    type: {
      type: 'custom',
      name: 'TDefault',
    },
  },
};
