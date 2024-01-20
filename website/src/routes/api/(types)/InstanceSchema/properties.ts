import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TClass: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'Class',
      href: '../Class/',
    },
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
    default: {
      type: 'custom',
      name: 'InstanceType',
      generics: [
        {
          type: 'custom',
          name: 'TClass',
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
          name: 'InstanceType',
          generics: [
            {
              type: 'custom',
              name: 'TClass',
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
      value: 'instance',
    },
  },
  class: {
    type: {
      type: 'custom',
      name: 'TClass',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'ErrorMessage',
      href: '../ErrorMessage/',
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
              name: 'InstanceType',
              generics: [
                {
                  type: 'custom',
                  name: 'TClass',
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
