import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const ShareIcon = component$<HTMLAttributes<SVGSVGElement>>((props) => (
  <svg
    viewBox="0 0 48 48"
    role="img"
    aria-label="Share icon"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={4}
    {...props}
  >
    <path d="M9.6 18.5a6 6 0 1 1-6 6 6 6 0 0 1 6-6Zm28.67-15a6 6 0 1 1-6 6 6 6 0 0 1 6-6Zm0 29a6 6 0 1 1-6 6 6 6 0 0 1 6-6Z" />
    <path d="m31.76 35.88-15.6-7.9m15.38-15.8-15.33 8.74" />
  </svg>
));
