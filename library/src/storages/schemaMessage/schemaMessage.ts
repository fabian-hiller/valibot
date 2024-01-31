import type { ErrorMessage } from '../../types/index.ts';

// Create schema message store
let store: Map<string | undefined, ErrorMessage> | undefined;

/**
 * Sets a schema error message.
 *
 * @param message The error message.
 * @param lang The language of the message.
 */
export function setSchemaMessage(message: ErrorMessage, lang?: string): void {
  if (!store) store = new Map();
  store.set(lang, message);
}

/**
 * Returns a schema error message.
 *
 * @param lang The language of the message.
 *
 * @returns The error message.
 */
export function getSchemaMessage(lang?: string): ErrorMessage | undefined {
  return store?.get(lang);
}

/**
 * Deletes a schema error message.
 *
 * @param lang The language of the message.
 */
export function deleteSchemaMessage(lang?: string): void {
  store?.delete(lang);
}
