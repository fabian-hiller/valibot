import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const MenuIcon = component$<HTMLAttributes<SVGSVGElement>>((props) => (
  <svg
    viewBox="0 0 48 48"
    role="img"
    aria-label="Menu icon"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-width={4}
    {...props}
  >
    <path d="M4 11h40M4 24h40M4 37h40" />
  </svg>
));
