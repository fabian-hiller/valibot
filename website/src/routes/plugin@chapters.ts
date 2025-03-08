import { routeAction$, routeLoader$ } from '@builder.io/qwik-city';

const COOKIE_NAME = 'chapters';

/**
 * Returns whether chapters are enabled.
 */
export const useChapters = routeLoader$(
  ({ cookie }) => (cookie.get(COOKIE_NAME)?.value ?? 'true') === 'true'
);

/**
 * Toggles the chapters by changing the chapters cookie.
 */
export const useChaptersToggle = routeAction$((_, { cookie }) => {
  cookie.set(COOKIE_NAME, `${!(cookie.get(COOKIE_NAME)?.value === 'true')}`, {
    httpOnly: true,
    maxAge: 31557600, // 1 year
    path: '/',
    sameSite: 'lax',
    secure: import.meta.env.PROD,
  });
});
