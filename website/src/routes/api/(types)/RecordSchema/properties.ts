import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TKey: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'RecordKey',
      href: '../RecordKey/',
    },
  },
  TValue: {
    modifier: 'extends',
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
    },
  },
  TOutput: {
    modifier: 'extends',
    type: 'any',
    default: {
      type: 'custom',
      name: 'RecordOutput',
      href: '../RecordOutput/',
      generics: [
        {
          type: 'custom',
          name: 'TKey',
        },
        {
          type: 'custom',
          name: 'TValue',
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
          name: 'RecordInput',
          href: '../RecordInput/',
          generics: [
            {
              type: 'custom',
              name: 'TKey',
            },
            {
              type: 'custom',
              name: 'TValue',
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
      value: 'record',
    },
  },
  key: {
    type: {
      type: 'custom',
      name: 'TKey',
    },
  },
  value: {
    type: {
      type: 'custom',
      name: 'TValue',
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
              name: 'RecordOutput',
              href: '../RecordOutput/',
              generics: [
                {
                  type: 'custom',
                  name: 'TKey',
                },
                {
                  type: 'custom',
                  name: 'TValue',
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
