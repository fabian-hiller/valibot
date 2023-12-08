import {
  $,
  component$,
  useComputed$,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import {
  Link,
  globalAction$,
  useLocation,
  z,
  zod$,
} from '@builder.io/qwik-city';
import clsx from 'clsx';
import { ThemeToggle } from './ThemeToggle';
import { useFocusTrap } from '~/hooks';
import { GitHubIconLink } from './GitHubIconLink';
import { MainMenuToggle } from './MainMenuToggle';
import { LogoIcon } from '~/icons';

/**
 * Toggles the open state of the main menu.
 */
export const useMainMenuToggle = globalAction$(
  (values) => values,
  zod$({ state: z.enum(['opened', 'closed']) })
);

/**
 * Fixed header with logo, main navigation and theme toogle.
 */
export const Header = component$(() => {
  // Use location, root element and scrolled signal
  const location = useLocation();
  const rootElement = useSignal<HTMLElement>();
  const windowScrolled = useSignal(false);

  // Use main menu toggle and compute open state
  const mainMenuToggle = useMainMenuToggle();
  const mainMenuOpen = useComputed$(() =>
    mainMenuToggle.isRunning
      ? // Optimistic UI
        mainMenuToggle.formData?.get('state') === 'opened'
      : mainMenuToggle.value?.state === 'opened'
  );

  // Use focus trap for main menu
  useFocusTrap(rootElement, mainMenuOpen);

  // Close main menu when location pathname changes
  useTask$(({ track }) => {
    track(() => location.url);
    if (
      mainMenuOpen.value &&
      location.prevUrl &&
      location.url.pathname !== location.prevUrl.pathname
    ) {
      mainMenuToggle.submit({ state: 'closed' });
    }
  });

  /**
   * Updates the window scrolled state.
   */
  const updateWindowScrolled = $(() => {
    windowScrolled.value = window.scrollY > 0;
  });

  return (
    <header
      class={clsx(
        'sticky top-0 h-14 md:h-16 lg:h-[70px]',
        mainMenuOpen.value ? 'z-30' : 'z-20'
      )}
      ref={rootElement}
      window:onScroll$={updateWindowScrolled}
    >
      {/* Header content */}
      <div
        class={clsx(
          'flex h-full items-center justify-between border-b-2 px-2 backdrop-blur duration-200 lg:px-4',
          mainMenuOpen.value && 'bg-white dark:bg-gray-900',
          !mainMenuOpen.value && windowScrolled.value
            ? 'border-b-slate-200 bg-white/90 dark:border-b-slate-800 dark:bg-gray-900/90'
            : 'border-b-transparent'
        )}
      >
        {/* Website logo */}
        <div class="-m-1 overflow-hidden p-1 lg:w-56">
          <Link
            class="focus-ring inline-flex w-full items-center rounded-lg p-2 font-medium transition-colors hover:text-slate-900 dark:hover:text-slate-200 md:w-auto md:text-lg lg:text-xl"
            href="/"
          >
            <LogoIcon class="mr-2 h-8 shrink-0 md:h-9 lg:mr-3 lg:h-10" />
            <div class="font-lexend-exa truncate bg-gradient-to-br from-slate-800 to-slate-600 bg-clip-text text-lg font-medium text-transparent dark:from-slate-200 dark:to-slate-400 md:text-xl lg:text-2xl">
              Valibot
            </div>
          </Link>
        </div>

        {/* Icon buttons (mobile) */}
        <div class="flex items-center space-x-4 lg:hidden">
          <GitHubIconLink />
          <ThemeToggle />
          <MainMenuToggle action={mainMenuToggle} open={mainMenuOpen.value} />
        </div>

        {/* Main menu */}
        <nav
          class={clsx(
            'absolute left-0 top-full flex max-h-[60vh] w-full origin-top flex-col overflow-y-auto border-b-2 pb-8 pt-4 duration-200 lg:static lg:top-auto lg:w-auto lg:translate-y-0 lg:flex-row lg:space-x-10 lg:overflow-visible lg:border-none lg:bg-transparent lg:p-0 lg:dark:bg-transparent',
            !mainMenuOpen.value &&
              'invisible scale-y-0 lg:visible lg:scale-y-100',
            (mainMenuOpen.value && 'bg-white dark:bg-gray-900') ||
              (windowScrolled.value && 'bg-white/90  dark:bg-gray-900/90'),
            mainMenuOpen.value || windowScrolled.value
              ? 'border-b-slate-200 dark:border-b-slate-800'
              : 'border-b-transparent'
          )}
          id="main-menu"
        >
          {[
            { label: 'Guides', href: '/guides' },
            { label: 'API reference', href: '/api' },
            { label: 'Playground', href: '/playground' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              class={clsx(
                'focus-ring mx-4 rounded-lg px-4 py-3 text-lg transition-colors hover:text-slate-900 dark:hover:text-slate-200 lg:px-3 lg:py-2 lg:text-[17px] lg:font-medium',
                location.url.pathname === href &&
                  'text-slate-900 dark:text-slate-200'
              )}
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Icon buttons (desktop) */}
        <div class="hidden lg:flex lg:w-56 lg:items-center lg:justify-end lg:space-x-6">
          <ThemeToggle />
          <div
            class="lg:block lg:h-5 lg:w-0.5 lg:rounded-full lg:bg-slate-200 lg:dark:bg-slate-800"
            role="separator"
          />
          <GitHubIconLink />
        </div>
      </div>

      {/* Background overlay */}
      <div
        class={clsx(
          'absolute top-0 -z-10 h-screen w-full bg-black/10 dark:bg-black/20 lg:hidden',
          mainMenuOpen.value
            ? 'delay-75 duration-300'
            : 'invisible opacity-0 duration-75'
        )}
        onClick$={() => mainMenuToggle.submit({ state: 'closed' })}
      />
    </header>
  );
});
