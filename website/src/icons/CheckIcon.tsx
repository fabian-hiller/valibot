import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const CheckIcon = component$<HTMLAttributes<SVGSVGElement>>((props) => (
  <svg
    viewBox="0 0 48 48"
    role="img"
    aria-label="Check icon"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={4}
    {...props}
  >
    <path d="M3.78 25.12 17.02 37.5l27.2-27" />
  </svg>
));
