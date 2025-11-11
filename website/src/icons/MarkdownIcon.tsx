import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const MarkdownIcon = component$<HTMLAttributes<SVGSVGElement>>(
  (props) => (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Markdown icon"
      fill="currentColor"
      {...props}
    >
      <path d="M42 9a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3h36zM6 6a6 6 0 0 0-6 6v24a6 6 0 0 0 6 6h36a6 6 0 0 0 6-6V12a6 6 0 0 0-6-6H6z"></path>
      <path d="M27.438 24.438a1.5 1.5 0 0 1 2.124 0L34.5 29.379l4.938-4.941a1.5 1.5 0 0 1 2.124 2.124l-6 6a1.5 1.5 0 0 1-2.124 0l-6-6a1.5 1.5 0 0 1 0-2.124z"></path>
      <path d="M34.5 15a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-3 0v-12a1.5 1.5 0 0 1 1.5-1.5z"></path>
      <path d="M10.68 33V21.03h.168l4.284 9.717h2.322l4.26-9.72h.168V33h3.219V15.003h-3.6l-5.13 11.682h-.117l-5.13-11.682H7.5V33h3.18z"></path>
    </svg>
  )
);
