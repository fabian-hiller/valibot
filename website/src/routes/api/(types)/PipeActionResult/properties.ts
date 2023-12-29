import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  PipeActionResult: {
    type: [
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
};
