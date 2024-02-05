import { routeAction$, routeLoader$, z, zod$ } from '@builder.io/qwik-city';

/**
 * Returns the current theme.
 */
export const useTheme = routeLoader$(({ cookie }) => {
  const theme = cookie.get('theme');
  return theme?.value === 'light' ? 'light' : 'dark';
});

/**
 * Toggles the theme by changing the theme cookie.
 */
export const useThemeToggle = routeAction$(
  ({ theme }, request) => {
    request.cookie.set('theme', theme, {
      httpOnly: true,
      maxAge: 31557600, // 1 year
      path: '/',
      sameSite: 'lax',
      secure: import.meta.env.PROD,
    });
  },
  zod$({
    theme: z.enum(['light', 'dark']),
  })
);
