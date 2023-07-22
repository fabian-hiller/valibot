import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { isBrowser } from '@builder.io/qwik/build';
import clsx from 'clsx';

type State = 'none' | 'start' | 'loading' | 'end';

/**
 * Loading animation that gives visual feedback that the route is being changed.
 */
export const RoutingIndicator = component$(() => {
  // Use is routing and create state signal
  const location = useLocation();
  const state = useSignal<State>('none');

  // Update state when is routing changes
  useTask$(({ track, cleanup }) => {
    const isNavigating = track(() => location.isNavigating);
    if (isBrowser) {
      if (isNavigating) {
        let frame = requestAnimationFrame(() => {
          state.value = 'start';
          frame = requestAnimationFrame(() => (state.value = 'loading'));
        });
        cleanup(() => cancelAnimationFrame(frame));
      } else {
        state.value = 'end';
        const timeout = setTimeout(() => (state.value = 'none'), 750);
        cleanup(() => clearTimeout(timeout));
      }
    }
  });

  return (
    <>
      {state.value !== 'none' && (
        <div
          class={clsx(
            'fixed z-50 h-0.5 w-screen origin-left bg-sky-600 md:h-[3px]',
            state.value === 'start' && 'scale-x-0',
            state.value === 'loading' && 'scale-x-75 duration-[3s] ease-linear',
            state.value === 'end' &&
              'opacity-0 [transition:transform_.5s_ease-in,opacity_.5s_linear_.25s]'
          )}
          role="status"
          aria-label="Route is changed"
        />
      )}
    </>
  );
});
