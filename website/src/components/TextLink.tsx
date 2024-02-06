import { component$, Slot } from '@builder.io/qwik';
import clsx from 'clsx';
import { UnstyledButton } from './UnstyledButton';

type TextLinkProps = {
  class?: string;
  href: string;
  download?: boolean | string;
  target?: '_blank';
  colored?: boolean;
  underlined?: boolean;
};

/**
 * Text links take users to another location and usually appear within a
 * sentence.
 */
export const TextLink = component$<TextLinkProps>(
  ({ href, download, target, colored, underlined, ...props }) => {
    return (
      <UnstyledButton
        class={clsx(
          'focus-ring rounded focus-visible:outline-offset-4 focus-visible:ring-offset-[6px]',
          colored && 'text-sky-600 dark:text-sky-400',
          underlined &&
            'underline decoration-slate-400 decoration-dashed underline-offset-[3px] dark:decoration-slate-600',
          props.class
        )}
        type="link"
        href={href}
        download={download}
        target={target}
      >
        <Slot />
      </UnstyledButton>
    );
  }
);
