import { type Signal, useTask$ } from '@builder.io/qwik';

/**
 * Creates a focus trap for a specific area for better accessibility when the
 * tab key is used for navigation.
 *
 * @param getRootElement The root element of the focus trap.
 * @param getActive Whether the focus trap is active.
 */
export function useFocusTrap(
  rootElement: Signal<HTMLElement | undefined>,
  active: Signal<boolean>
) {
  useTask$(({ track, cleanup }) => {
    if (track(() => active.value)) {
      const rootElementValue = track(() => rootElement.value);
      if (rootElementValue) {
        // Get current active element
        const { activeElement } = document;

        // Focus root element
        rootElementValue.focus();

        // Query focusable elements
        const elements = [
          ...rootElementValue.querySelectorAll<
            HTMLAnchorElement | HTMLButtonElement | HTMLInputElement
          >('a, button'),
        ].filter((element) => element.offsetParent !== null);

        // Get first and last focusable element
        const firstElement = elements[0];
        const lastElement = elements[elements.length - 1];

        /**
         * Traps the focus within the root element.
         */
        const trapFocus = (event: KeyboardEvent) => {
          // Continue if user pressed "Tab" key
          if (event.key === 'Tab') {
            // Get currently active element
            const { activeElement } = document;

            // Prevent user from leaving focus area by manually focusing
            // first or last focusable element of the root element
            if (
              (event.shiftKey && firstElement === activeElement) ||
              (!event.shiftKey && lastElement === activeElement)
            ) {
              event.preventDefault();
              (event.shiftKey ? lastElement : firstElement).focus();
            }
          }
        };

        // Add event listener to root element
        rootElementValue.addEventListener('keydown', trapFocus);

        cleanup(() => {
          // Remove event listener form root element
          rootElementValue.removeEventListener('keydown', trapFocus);

          // Focus prevoius active element if possible
          if (activeElement instanceof HTMLElement) {
            activeElement.focus({ preventScroll: true });
          }
        });
      }
    }
  });
}
