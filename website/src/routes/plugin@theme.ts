import { routeAction$, routeLoader$ } from '@builder.io/qwik-city';

const COOKIE_NAME = 'theme';

/**
 * Returns the current theme.
 */
export const useTheme = routeLoader$(({ cookie }) =>
  cookie.get(COOKIE_NAME)?.value === 'light' ? 'light' : 'dark'
);

/**
 * Toggles the theme by changing the theme cookie.
 */
export const useThemeToggle = routeAction$((_, { cookie }) => {
  cookie.set(
    COOKIE_NAME,
    cookie.get(COOKIE_NAME)?.value === 'light' ? 'dark' : 'light',
    {
      httpOnly: true,
      maxAge: 31557600, // 1 year
      path: '/',
      sameSite: 'lax',
      secure: import.meta.env.PROD,
    }
  );
});
