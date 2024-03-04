import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const BinIcon = component$<HTMLAttributes<SVGSVGElement>>((props) => (
  <svg
    viewBox="0 0 44 48"
    role="img"
    aria-label="Bin icon"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={4}
    {...props}
  >
    <path d="m8.4 16.41 1.37 22.74a4.94 4.94 0 0 0 4.57 4.5h14.87c4.15 0 4.88-2.77 5.08-4.5l1.5-22.74" />
    <path d="m17.57 16.41.5 21.56m8.42-21.56-.5 21.56" />
    <path d="M15.51 9.19v-3.1a1.8 1.8 0 0 1 1.82-1.8h9.1a1.9 1.9 0 0 1 2.03 1.8v3.1" />
    <path d="M5.22 10.37h33.56" />
  </svg>
));
