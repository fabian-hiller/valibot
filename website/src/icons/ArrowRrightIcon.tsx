import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const ArrowRightIcon = component$<HTMLAttributes<HTMLElement>>(
  (props) => (
    <svg
      viewBox="0 0 45 48"
      role="img"
      aria-label="Arrow right icon"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={4}
      {...props}
    >
      <path d="M3.58 23.98h37.33" />
      <path d="m27.56 37.88 13.97-13.92L27.56 10.2" />
    </svg>
  )
);
