import { component$ } from '@builder.io/qwik';
import { type ActionStore, Form } from '@builder.io/qwik-city';
import clsx from 'clsx';

type MainMenuToggleProps = {
  action: ActionStore<any, any, false>;
  open: boolean;
};

/**
 * Button for opening and closing the main menu. Depending on the status, a
 * hamburger or close icon is displayed.
 */
export const MainMenuToggle = component$<MainMenuToggleProps>(
  ({ action, open }) => (
    <Form action={action}>
      <input name="state" type="hidden" value={open ? 'closed' : 'opened'} />
      <button
        class={clsx(
          'focus-ring group/button rounded-lg p-2',
          !open && 'rotate-180'
        )}
        type="submit"
        aria-expanded={open}
        aria-label={`${open ? 'Close' : 'Open'} main menu`}
        aria-controls="main-menu"
      >
        <div class="relative flex h-5 w-5 items-center justify-center md:h-[22px] md:w-[22px]">
          {[...Array(3).keys()].map((index) => (
            <div
              key={index}
              class={clsx(
                'absolute h-[1.5px] w-full rounded-full bg-slate-600 transition group-hover/button:bg-slate-900 dark:bg-slate-400 dark:group-hover/button:bg-slate-200',
                index === 1 && open && 'opacity-0',
                index === 0 && (open ? '-rotate-45' : '-translate-y-1.5'),
                index === 2 && (open ? 'rotate-45' : 'translate-y-1.5')
              )}
            />
          ))}
        </div>
      </button>
    </Form>
  )
);
