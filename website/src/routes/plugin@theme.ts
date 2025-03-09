import {
  type RequestEventAction,
  routeAction$,
  routeLoader$,
} from '@builder.io/qwik-city';

const COOKIE_NAME = 'theme';

/**
 * Returns the value of the theme cookie.
 */
function getCookie(request: RequestEventAction) {
  return request.cookie.get(COOKIE_NAME)?.value ?? 'dark';
}

/**
 * Returns the current theme.
 */
export const useTheme = routeLoader$((request) => getCookie(request));

/**
 * Toggles the theme by changing the theme cookie.
 */
export const useThemeToggle = routeAction$((_, request) => {
  request.cookie.set(
    COOKIE_NAME,
    getCookie(request) === 'dark' ? 'light' : 'dark',
    {
      httpOnly: true,
      maxAge: 31557600, // 1 year
      path: '/',
      sameSite: 'lax',
      secure: import.meta.env.PROD,
    }
  );
});
