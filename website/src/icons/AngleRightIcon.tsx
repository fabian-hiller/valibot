import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const AngleRightIcon = component$<HTMLAttributes<SVGSVGElement>>(
  (props) => (
    <svg
      viewBox="0 0 26 48"
      role="img"
      aria-label="Angle right icon"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={4}
      {...props}
    >
      <path d="m3.72 42.4 18.57-18.5L3.72 5.6" />
    </svg>
  )
);
