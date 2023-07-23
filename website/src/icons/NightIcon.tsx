import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const NightIcon = component$<HTMLAttributes<HTMLElement>>((props) => (
  <svg
    viewBox="0 0 48 48"
    role="img"
    aria-label="Night icon"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={4}
    {...props}
  >
    <path d="M16.74 9C9.06 10.82-2.41 26.42 8.45 38.85s28.14 2.17 30.61-5.63c0 0-12.55 5.25-20.65-3.68S16.74 9 16.74 9Zm13.03-.51h5.9l1.84-5.7 1.86 5.7h5.44l-4.35 3.24L42.63 18l-5.23-3.93-4.88 3.67 1.94-5.77Z" />
  </svg>
));
