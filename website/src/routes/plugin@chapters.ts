import {
  type RequestEventAction,
  routeAction$,
  routeLoader$,
} from '@builder.io/qwik-city';

const COOKIE_NAME = 'chapters';

/**
 * Returns the value of the chapters cookie.
 */
function getCookie(request: RequestEventAction) {
  return request.cookie.get(COOKIE_NAME)?.value ?? 'true';
}

/**
 * Returns whether chapters are enabled.
 */
export const useChapters = routeLoader$(
  (request) => getCookie(request) === 'true'
);

/**
 * Toggles the chapters by changing the chapters cookie.
 */
export const useChaptersToggle = routeAction$((_, request) => {
  request.cookie.set(COOKIE_NAME, `${getCookie(request) !== 'true'}`, {
    httpOnly: true,
    maxAge: 31557600, // 1 year
    path: '/',
    sameSite: 'lax',
    secure: import.meta.env.PROD,
  });
});
