import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const PenIcon = component$<HTMLAttributes<SVGSVGElement>>((props) => (
  <svg
    viewBox="0 0 48 48"
    role="img"
    aria-label="Pen icon"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={4}
    {...props}
  >
    <path d="M42.5 14.24 13.25 43.17l-9.34.85.86-9.1 29.2-29.14c5.3-5.3 13.92 3.1 8.55 8.46Z" />
    <path d="m12.52 29.16 6.37 6.52" />
  </svg>
));
