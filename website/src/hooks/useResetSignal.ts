import { useSignal, useTask$ } from '@builder.io/qwik';

/**
 * Creates a signal that resets to its initial value after a delay.
 *
 * @param initialValue The initial value.
 * @param delay The delay in milliseconds.
 *
 * @returns The reset signal.
 */
export function useResetSignal<T>(initialValue: T, delay = 1000) {
  // Use signal
  const signal = useSignal<T>(initialValue);

  // Reset signal after delay
  useTask$(({ track, cleanup }) => {
    if (track(signal)) {
      const timeout = setTimeout(() => {
        signal.value = initialValue;
      }, delay);
      cleanup(() => clearTimeout(timeout));
    }
  });

  // Return signal
  return signal;
}
