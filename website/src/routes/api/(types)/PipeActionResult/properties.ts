import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  TOutput: {
    modifier: 'extends',
    type: 'any',
  },
  PipeActionResult: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'ValidActionResult',
          href: '../ValidActionResult/',
          generics: [{ type: 'custom', name: 'TOutput' }],
        },
        {
          type: 'custom',
          name: 'InvalidActionResult',
          href: '../InvalidActionResult/',
        },
      ],
    },
  },
};
