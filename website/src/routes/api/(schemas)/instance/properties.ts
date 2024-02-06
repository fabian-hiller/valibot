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
  class_: {
    type: {
      type: 'custom',
      name: 'TClass',
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
              name: 'TClass',
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
      name: 'InstanceSchema',
      href: '../InstanceSchema/',
      generics: [
        {
          type: 'custom',
          name: 'TClass',
        },
      ],
    },
  },
};
