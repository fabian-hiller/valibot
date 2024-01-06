import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  issues: {
    type: {
      type: 'array',
      item: {
        type: 'custom',
        name: 'Pick',
        generics: [
          {
            type: 'custom',
            name: 'Issue',
            href: '../Issue/',
          },
          [
            {
              type: 'string',
              value: 'validation',
            },
            {
              type: 'string',
              value: 'message',
            },
            {
              type: 'string',
              value: 'input',
            },
            {
              type: 'string',
              value: 'requirement',
            },
            {
              type: 'string',
              value: 'path',
            },
          ],
        ],
      },
    },
  },
};
