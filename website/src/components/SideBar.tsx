import {
  $,
  Slot,
  component$,
  useComputed$,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import {
  Form,
  globalAction$,
  useLocation,
  z,
  zod$,
} from '@builder.io/qwik-city';
import clsx from 'clsx';
import { useFocusTrap } from '~/hooks';
import { AngleUpIcon } from '~/icons';

/**
 * Toggles the open state of the side bar.
 */
export const useSideBarToggle = globalAction$(
  (values) => values,
  zod$({ state: z.enum(['opened', 'closed']) })
);

/**
 * Sidebar that can be extended from the bottom on smaller devices and
 * displayed on the side next to the main content on larger ones.
 */
export const SideBar = component$(() => {
  // Use location and element signal
  const location = useLocation();
  const element = useSignal<HTMLElement>();

  // Use side bar toggle and compute open state
  const sideBarToggle = useSideBarToggle();
  const sideBarOpen = useComputed$(
    () => sideBarToggle.value?.state === 'opened'
  );

  // Use focus trap for sidebar
  useFocusTrap(element, sideBarOpen);

  // Close side bar when location pathname changes
  useTask$(({ track }) => {
    track(() => location.url);
    if (
      sideBarOpen.value &&
      location.prevUrl &&
      location.url.pathname !== location.prevUrl.pathname
    ) {
      sideBarToggle.submit({ state: 'closed' });
    }
  });

  /**
   * Closes the side bar when the window width is changed to desktop.
   */
  const handleResize = $(() => {
    if (window.innerWidth >= 1024) {
      sideBarToggle.submit({ state: 'closed' });
    }
  });

  return (
    <aside
      class={clsx(
        'sticky bottom-0 h-14 md:h-16 lg:top-[70px] lg:h-auto lg:max-h-[calc(100vh-70px)]',
        sideBarOpen.value ? 'z-30' : 'z-10'
      )}
      ref={element}
      window:onResize$={handleResize}
    >
      {/* Content */}
      <div
        class={clsx(
          'flex h-full items-center justify-end border-t-2 border-t-slate-200 backdrop-blur duration-200 dark:border-t-slate-800 lg:items-start lg:border-none',
          sideBarOpen.value
            ? 'bg-white dark:bg-gray-900'
            : 'bg-white/90 dark:bg-gray-900/90'
        )}
        id="side-bar"
      >
        {/* Buttons */}
        <Slot name="buttons" />

        {/* Toggle */}
        <Form action={sideBarToggle}>
          <input
            type="hidden"
            name="state"
            value={sideBarOpen.value ? 'closed' : 'opened'}
          />
          <button
            class="focus-ring m-1 box-content flex h-5 w-5 justify-center rounded-xl p-2.5 hover:text-slate-900 dark:hover:text-slate-200 md:h-6 md:w-6 lg:hidden"
            aria-expanded={sideBarOpen.value}
            aria-label={`${sideBarOpen.value ? 'Close' : 'Open'} side bar`}
            aria-controls="side-bar"
          >
            <AngleUpIcon
              class={clsx(
                'h-full duration-200',
                sideBarOpen.value && '-rotate-180'
              )}
            />
          </button>
        </Form>

        {/* Children */}
        <div
          class={clsx(
            'absolute bottom-full max-h-[60vh] w-full origin-bottom overflow-auto overscroll-contain border-t-2 border-t-slate-200 bg-white py-9 duration-200 dark:border-t-slate-800 dark:bg-gray-900 lg:static lg:max-h-full lg:w-auto lg:translate-y-0 lg:border-none lg:py-32',
            !sideBarOpen.value &&
              'invisible scale-y-0 lg:visible lg:scale-y-100'
          )}
        >
          <Slot />
        </div>

        {/* Gradient overlay */}
        <div
          class={clsx(
            'pointer-events-none fixed bottom-14 z-20 h-14 w-full origin-bottom translate-y-0.5 bg-gradient-to-b from-transparent to-white duration-300 dark:to-gray-900 md:bottom-16 lg:hidden',
            !sideBarOpen.value && 'invisible scale-y-0'
          )}
        />
      </div>

      {/* Background overlay */}
      <div
        class={clsx(
          'absolute bottom-0 -z-10 h-screen w-full bg-black/10 dark:bg-black/20 lg:hidden',
          sideBarOpen.value ? 'duration-300' : 'invisible opacity-0 duration-75'
        )}
        onClick$={() => sideBarToggle.submit({ state: 'closed' })}
      />
    </aside>
  );
});
