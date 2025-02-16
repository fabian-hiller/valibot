import {
  component$,
  noSerialize,
  type NoSerialize,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { injectSpeedInsights } from '@vercel/speed-insights';

/**
 * Component for tracking speed insights performance metrics.
 */
export const SpeedInsights = component$(() => {
  // Use location and set route signal
  const location = useLocation();
  const setRoute = useSignal<NoSerialize<(path: string) => void>>();

  // Initialize speed insights and update route
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    ({ track }) => {
      // Track URL pathname
      const pathname = track(() => location.url.pathname);

      // Set route if script is already initialized
      if (setRoute.value) {
        setRoute.value(pathname);

        // Otherwise, set route on script initialization
      } else {
        const script = injectSpeedInsights({
          framework: 'qwik',
          route: pathname,
        });

        // If script is available, set route signal
        if (script) {
          setRoute.value = noSerialize(script.setRoute);
        }
      }
    },
    { strategy: 'document-ready' }
  );

  return null;
});
