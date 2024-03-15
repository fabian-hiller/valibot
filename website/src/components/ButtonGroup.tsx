import { component$, Slot } from '@builder.io/qwik';
import clsx from 'clsx';

type ButtonGroupProps = {
  class?: string;
};

/**
 * Button group displays multiple related actions side-by-side and helps with
 * arrangement and spacing.
 */
export const ButtonGroup = component$<ButtonGroupProps>((props) => (
  <div class={clsx('flex flex-wrap gap-6 lg:gap-8', props.class)}>
    <Slot />
  </div>
));
