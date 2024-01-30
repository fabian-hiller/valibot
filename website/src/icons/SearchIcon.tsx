import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const SearchIcon = component$<HTMLAttributes<HTMLElement>>((props) => (
  <svg
    viewBox="0 0 43 48"
    role="img"
    aria-label="Search icon"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-width={4}
    {...props}
  >
    <path d="M18 5.57A14.15 14.15 0 1 1 3.86 19.72 14.15 14.15 0 0 1 18.01 5.57Zm21.14 36.86-11.7-11.72" />
  </svg>
));
