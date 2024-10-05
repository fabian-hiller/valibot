import { useSignal, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import { isBrowser } from '@builder.io/qwik/build';

/**
 * Creates a signal that is synchronized with localStorage.
 *
 * @param key The storage key.
 * @param initialValue The initial value.
 *
 * @returns The storage signal.
 */
export function useStorageSignal<T>(key: string, initialValue: T) {
  // Use signal
  const signal = useSignal<T>(initialValue);

  // Get initial value from local storage
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const value = localStorage.getItem(key);
    if (value) {
      signal.value = JSON.parse(value);
    }
  });

  // Update local storage when signal changes
  useTask$(({ track }) => {
    const value = track(signal);
    if (isBrowser) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });

  // Return signal
  return signal;
}
