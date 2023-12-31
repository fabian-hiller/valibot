import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  message: {
    type: [
      {
        type: 'custom',
        name: 'ErrorMessage',
        href: '../ErrorMessage/',
      },
      'undefined',
    ],
    default: {
      type: 'string',
      value: 'Invalid type',
    },
  },
  Schema: {
    type: [
      {
        type: 'custom',
        name: 'NanSchema',
        href: '../NanSchema/',
      },
    ],
  },
};
