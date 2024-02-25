import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const PlayIcon = component$<HTMLAttributes<SVGSVGElement>>((props) => (
  <svg
    viewBox="0 0 47 48"
    role="img"
    aria-label="Play icon"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={4}
    {...props}
  >
    <path d="M5.4 39.15V8.8a5.14 5.14 0 0 1 7.79-4.29l26 15.17a4.93 4.93 0 0 1 0 8.58l-26 15.17a5.2 5.2 0 0 1-2.64.72 5.08 5.08 0 0 1-5.15-5.01Z" />
  </svg>
));
