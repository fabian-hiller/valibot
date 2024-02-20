import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const LogoIcon = component$<HTMLAttributes<SVGSVGElement>>((props) => (
  <svg viewBox="0 0 48 48" role="img" aria-label="Valibot icon" {...props}>
    <defs>
      <linearGradient
        id="nCrZ"
        x1=".41"
        x2="0"
        y1=".26"
        y2=".93"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0" stop-color="#eab308" />
        <stop offset="1" stop-color="#ca8a04" />
      </linearGradient>
      <linearGradient
        id="jgAy"
        x1=".34"
        x2=".66"
        y1=".02"
        y2=".97"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0" stop-color="#fde68a" />
        <stop offset="1" stop-color="#fbbf24" />
      </linearGradient>
      <linearGradient
        id="YpWK"
        x2="1"
        y1=".5"
        y2=".5"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0" stop-color="#7dd3fc" />
        <stop offset="1" stop-color="#0ea5e9" />
      </linearGradient>
    </defs>
    <path
      fill="url(#nCrZ)"
      d="M629.38 987.02c-6.26 0-11.17 5.13-11.43 11.86l-.24 8.95c-.37 7.37 6.75 9.89 11.9 9.89Z"
      transform="translate(-615.34 -978.37)"
    />
    <path
      fill="url(#jgAy)"
      d="M8.68 0h21.3a9 9 0 0 1 9.23 8.75l.58 12.73c.07 6.31-4.51 8.9-9.8 8.94l-21.31.27c-5.49.04-8.78-4.1-8.68-9.21L.35 8.75C.7 3.15 3.13.1 8.69 0Z"
      transform="translate(5.85 8.65)"
    />
    <path
      fill="#111827"
      d="M15.73 9.63h19.98a8.4 8.4 0 0 1 8.65 8.14l.54 11.84c.06 5.88-4.23 8.28-9.19 8.32l-19.98.25c-5.14.04-8.24-3.81-8.14-8.57l.34-11.84c.31-5.21 2.59-8.04 7.8-8.14Z"
    />
    <path
      fill="url(#YpWK)"
      d="M2.59 0A2.59 2.59 0 1 1 0 2.59 2.59 2.59 0 0 1 2.59 0Z"
      transform="translate(34.23 19.25)"
    />
    <path
      fill="url(#YpWK)"
      d="M2.59 0A2.59 2.59 0 1 1 0 2.59 2.59 2.59 0 0 1 2.59 0Z"
      transform="translate(14.25 19.25)"
    />
  </svg>
));
