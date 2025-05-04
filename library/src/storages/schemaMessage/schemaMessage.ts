import type { BaseIssue, ErrorMessage } from '../../types/index.ts';

// Create schema message store
let store: Map<string | undefined, ErrorMessage<BaseIssue<unknown>>>;

/**
 * Sets a schema error message.
 *
 * @param message The error message.
 * @param lang The language of the message.
 */
export function setSchemaMessage(
  message: ErrorMessage<BaseIssue<unknown>>,
  lang?: string
): void {
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
// @__NO_SIDE_EFFECTS__
export function getSchemaMessage(
  lang?: string
): ErrorMessage<BaseIssue<unknown>> | undefined {
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
