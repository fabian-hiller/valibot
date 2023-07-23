import { component$, useComputed$, useTask$ } from '@builder.io/qwik';
import { Form } from '@builder.io/qwik-city';
import { isBrowser } from '@builder.io/qwik/build';
import { NightIcon, SunIcon } from '~/icons';
import { useTheme, useThemeToggle } from '~/routes/plugin@theme';
import { disableTransitions } from '~/utils';
import { SystemIcon } from './SystemIcon';

type ThemeToggleProps = {
  class?: string;
};

/**
 * Button for switching the color theme. Depending on the status, a sun or
 * night icon is displayed.
 */
export const ThemeToggle = component$<ThemeToggleProps>((props) => {
  // Use theme and theme toggle
  const theme = useTheme();
  const themeToggle = useThemeToggle();

  // Disable CSS transitions while changing theme
  useTask$(({ track }) => {
    const isRunning = track(() => themeToggle.isRunning);
    if (isBrowser && !isRunning) {
      disableTransitions();
    }
  });

  // Compute value of next theme
  const nextTheme = useComputed$(() =>
    theme.value === 'dark' ? 'light' : 'dark'
  );

  return (
    <Form class={props.class} action={themeToggle}>
      <input name="theme" type="hidden" value={nextTheme.value} />
      <SystemIcon type="submit" label={`Change theme to ${nextTheme.value}`}>
        <SunIcon class="hidden h-full dark:block" />
        <NightIcon class="h-full dark:hidden" />
      </SystemIcon>
    </Form>
  );
});
