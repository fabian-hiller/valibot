import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const CopyIcon = component$<HTMLAttributes<SVGSVGElement>>((props) => (
  <svg
    viewBox="0 0 43 48"
    role="img"
    aria-label="Copy icon"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={4}
    {...props}
  >
    <path d="M16.96 7.2h17.1a4.5 4.5 0 0 1 4.5 4.5v18a4.5 4.5 0 0 1-4.5 4.5h-17.1a4.5 4.5 0 0 1-4.5-4.5v-18a4.5 4.5 0 0 1 4.5-4.5Z" />
    <path d="M7.84 15.25c-.55 0-3.3.4-3.3 3.14v19.93c0 3.21 1.87 3.93 4.23 3.93h18.4c2.32 0 3.29-2.3 3.29-3.62" />
  </svg>
));
