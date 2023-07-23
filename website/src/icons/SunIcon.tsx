import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const SunIcon = component$<HTMLAttributes<HTMLElement>>((props) => (
  <svg
    viewBox="0 0 48 48"
    role="img"
    aria-label="Sun icon"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={4}
    {...props}
  >
    <path d="m34.9 35 3.55 3.53Zm-21.75-.1L9.6 38.43ZM16.5 24a7.5 7.5 0 1 1 7.5 7.5 7.5 7.5 0 0 1-7.5-7.5Zm22-14.4-3.55 3.52Zm-29.05 0L13 13.11Z" />
    <path d="M24 2.5v6M45.5 24h-6m-31 0h-6M24 39.5v6" />
  </svg>
));
