import { useSignal, useVisibleTask$ } from '@builder.io/qwik';

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

  // Get initial value from localStorage
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const value = localStorage.getItem(key);
    if (value) {
      signal.value = JSON.parse(value);
    }
  });

  // Update localStorage when signal changes
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    const value = track(() => signal.value);
    localStorage.setItem(key, JSON.stringify(value));
  });

  // Return signal
  return signal;
}
