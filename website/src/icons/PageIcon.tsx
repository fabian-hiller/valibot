import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const PageIcon = component$<HTMLAttributes<SVGSVGElement>>((props) => (
  <svg
    viewBox="0 0 39 48"
    role="img"
    aria-label="Page icon"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={4}
    {...props}
  >
    <path d="M10 5h14.35L35 16.06V37a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V11a6 6 0 0 1 6-6Z" />
    <path d="M19.5 12.89v6.05a2.33 2.33 0 0 0 2.17 2.37h5.55" />
  </svg>
));
