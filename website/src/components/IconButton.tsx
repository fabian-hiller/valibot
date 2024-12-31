import { component$, Slot } from '@builder.io/qwik';
import clsx from 'clsx';
import { type DefaultButtonProps, UnstyledButton } from './UnstyledButton';

type IconButtonProps = DefaultButtonProps & {
  variant: 'primary' | 'secondary';
  label: string;
  align?: 'right';
  hideLabel?: boolean;
};

/**
 * Button with an icon that is used for navigation, to confirm form entries or
 * perform individual actions.
 */
export const IconButton = component$<IconButtonProps>(
  ({ label, variant, align, hideLabel, ...props }) => (
    <UnstyledButton
      {...props}
      class={clsx(
        'focus-ring group/button flex items-center rounded-xl backdrop-blur',
        align === 'right' && 'flex-row-reverse',
        props.class
      )}
      aria-label={label}
    >
      <span
        class={clsx(
          'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
          variant === 'primary' &&
            'bg-sky-600 text-white group-hover/button:bg-sky-600/80 dark:bg-sky-400 dark:text-gray-900 dark:group-hover/button:bg-sky-400/80',
          variant === 'secondary' &&
            'bg-sky-600/10 text-sky-600 group-hover/button:bg-sky-600/20 dark:bg-sky-400/10 dark:text-sky-400 dark:group-hover/button:bg-sky-400/20'
        )}
      >
        <Slot />
      </span>
      {!hideLabel && (
        <span
          class={clsx(
            'mx-4 transition-colors group-hover/button:text-slate-700 md:mx-6 md:text-lg lg:mx-8 lg:text-xl dark:group-hover/button:text-slate-200'
          )}
        >
          {label}
        </span>
      )}
    </UnstyledButton>
  )
);
