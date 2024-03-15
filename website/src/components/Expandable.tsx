import {
  $,
  component$,
  Slot,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import clsx from 'clsx';

type ExpandableProps = {
  class?: string;
  id?: string;
  expanded: boolean;
};

/**
 * Wrapper component to vertically expand or collapse content.
 */
export const Expandable = component$<ExpandableProps>(
  ({ id, expanded, ...props }) => {
    // Use element signal
    const element = useSignal<HTMLDivElement>();

    /**
     * Updates the expandable element height.
     */
    const updateElementHeight = $(() => {
      element.value!.style.maxHeight = '0';
      element.value!.style.height = `${
        expanded ? element.value!.scrollHeight : 0
      }px`;
      element.value!.style.maxHeight = '';
    });

    // Expand or collapse content when expanded prop change
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
      track(() => expanded);
      updateElementHeight();
    });

    return (
      <div
        class={clsx(
          '!m-0 origin-top duration-200',
          !expanded && 'invisible h-0 -translate-y-2 scale-y-75 opacity-0',
          props.class
        )}
        id={id}
        ref={element}
        aria-hidden={!expanded}
        window:onResize$={updateElementHeight}
      >
        <Slot />
      </div>
    );
  }
);
