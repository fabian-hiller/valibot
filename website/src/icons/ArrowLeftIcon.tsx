import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const ArrowLeftIcon = component$<HTMLAttributes<SVGSVGElement>>(
  (props) => (
    <svg
      viewBox="0 0 45 48"
      role="img"
      aria-label="Arrow left icon"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={4}
      {...props}
    >
      <path d="M41.52 23.98H4.2" />
      <path d="M17.55 37.88 3.58 23.96 17.55 10.2" />
    </svg>
  )
);
