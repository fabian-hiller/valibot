import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TOptions: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'IntersectOptions',
      href: '../IntersectOptions/',
    },
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
    default: {
      type: 'custom',
      name: 'IntersectOutput',
      href: '../IntersectOutput/',
      generics: [
        {
          type: 'custom',
          name: 'TOptions',
          href: '../TOptions/',
        },
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
          name: 'IntersectInput',
          href: '../IntersectInput/',
          generics: [
            {
              type: 'custom',
              name: 'TOptions',
              href: '../TOptions/',
            },
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
      value: 'intersect',
    },
  },
  options: {
    type: {
      type: 'custom',
      name: 'TOptions',
    },
  },
  message: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ErrorMessage',
          href: '../ErrorMessage/',
        },
        'undefined',
      ],
    },
  },
  pipe: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Pipe',
          href: '../Pipe/',
          generics: [
            {
              type: 'custom',
              name: 'IntersectOutput',
              href: '../IntersectOutput/',
              generics: [
                {
                  type: 'custom',
                  name: 'TOptions',
                  href: '../TOptions/',
                },
              ],
            },
          ],
        },
        'undefined',
      ],
    },
  },
};
