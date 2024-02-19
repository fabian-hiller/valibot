import type { ErrorMessage } from '../../types/index.ts';

// Create global message store
let store: Map<string | undefined, ErrorMessage> | undefined;

/**
 * Sets a global error message.
 *
 * @param message The error message.
 * @param lang The language of the message.
 */
export function setGlobalMessage(message: ErrorMessage, lang?: string): void {
  if (!store) store = new Map();
  store.set(lang, message);
}

/**
 * Returns a global error message.
 *
 * @param lang The language of the message.
 *
 * @returns The error message.
 */
export function getGlobalMessage(lang?: string): ErrorMessage | undefined {
  return store?.get(lang);
}

/**
 * Deletes a global error message.
 *
 * @param lang The language of the message.
 */
export function deleteGlobalMessage(lang?: string): void {
  store?.delete(lang);
}
