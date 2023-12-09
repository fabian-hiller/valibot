import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const CloseIcon = component$<HTMLAttributes<HTMLElement>>((props) => (
  <svg
    viewBox="0 0 40 48"
    role="img"
    aria-label="Close icon"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-width={4}
    {...props}
  >
    <path d="M36.27 7.73 3.73 40.27m32.54 0L3.73 7.73" />
  </svg>
));
