import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'ArrayInput',
      href: '../ArrayInput/',
    },
  },
  ArrayRequirementAsync: {
    type: {
      type: 'function',
      params: [
        {
          name: 'params',
          spread: true,
          type: {
            type: 'custom',
            name: 'Parameters',
            generics: [
              {
                type: 'custom',
                name: 'ArrayRequirement',
                href: '../ArrayRequirement/',
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
      ],
      return: {
        type: 'custom',
        name: 'MaybePromise',
        href: '../MaybePromise/',
        generics: [
          {
            type: 'custom',
            name: 'ReturnType',
            generics: [
              {
                type: 'custom',
                name: 'ArrayRequirement',
                href: '../ArrayRequirement/',
                generics: [
                  {
                    type: 'custom',
                    name: 'TInput',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
};
