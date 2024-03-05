import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const AngleUpIcon = component$<HTMLAttributes<SVGSVGElement>>(
  (props) => (
    <svg
      viewBox="0 0 36 48"
      role="img"
      aria-label="Angle up icon"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={4}
      {...props}
    >
      <path d="M4.15 30.96 18.07 17l13.76 13.96" />
    </svg>
  )
);
