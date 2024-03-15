/* eslint-disable @typescript-eslint/ban-types */
import type { ErrorMessage } from '../../types/index.ts';

// Create specific message store
let store: Map<Function, Map<string | undefined, ErrorMessage>> | undefined;

/**
 * Sets a specific error message.
 *
 * @param reference The identifier reference.
 * @param message The error message.
 * @param lang The language of the message.
 */
export function setSpecificMessage(
  reference: Function,
  message: ErrorMessage,
  lang?: string
): void {
  if (!store) store = new Map();
  if (!store.get(reference)) store.set(reference, new Map());
  store.get(reference)!.set(lang, message);
}

/**
 * Returns a specific error message.
 *
 * @param reference The identifier reference.
 * @param lang The language of the message.
 *
 * @returns The error message.
 */
export function getSpecificMessage(
  reference: Function,
  lang?: string
): ErrorMessage | undefined {
  return store?.get(reference)?.get(lang);
}

/**
 * Deletes a specific error message.
 *
 * @param reference The identifier reference.
 * @param lang The language of the message.
 */
export function deleteSpecificMessage(
  reference: Function,
  lang?: string
): void {
  store?.get(reference)?.delete(lang);
}
