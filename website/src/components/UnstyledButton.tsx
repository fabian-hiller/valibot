import { component$, Slot } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

type LinkProps = {
  type: 'link';
  href: string;
  download?: boolean | string;
  target?: '_blank';
};

type ButtonProps = {
  type: 'button' | 'submit';
  'preventdefault:click'?: boolean;
  onClick$?: () => any;
};

export type DefaultButtonProps = LinkProps | ButtonProps;

type UnstyledButtonProps = DefaultButtonProps & {
  class?: string;
  'aria-label'?: string;
};

/**
 * Basic button component that contains important functionality and is used to
 * build more complex components on top of it.
 */
export const UnstyledButton = component$((props: UnstyledButtonProps) => {
  if (props.type === 'link') {
    // External link
    if (props.target === '_blank') {
      return (
        <a {...props} rel="noreferrer">
          <Slot />
        </a>
      );
    }

    // Internal link
    return (
      <Link {...props}>
        <Slot />
      </Link>
    );
  }

  // Normal button
  return (
    <button {...props}>
      <Slot />
    </button>
  );
});
