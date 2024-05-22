import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TInput: {
    modifier: 'extends',
    type: 'any',
  },
  check: {
    type: {
      type: 'function',
      params: [
        {
          name: 'input',
          type: 'unknown',
        },
      ],
      return: 'boolean',
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
              name: 'TInput',
            },
          ],
        },
        'undefined',
      ],
    },
  },
  Schema: {
    type: {
      type: 'custom',
      name: 'SpecialSchema',
      href: '../SpecialSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TInput',
        },
      ],
    },
  },
};
