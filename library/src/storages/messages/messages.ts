import type { ErrorMessage } from '../../types/index.ts';

// Create global and local message store
let global: Record<string, ErrorMessage | undefined> | undefined;
let local: Record<string, Record<string, ErrorMessage | undefined>> | undefined;

/**
 * Sets a global error message.
 *
 * @param message The error message.
 * @param lang The language of the message.
 */
export function setGlobalMessage(
  message: ErrorMessage | undefined,
  lang = '_'
): void {
  if (!global) global = {};
  global[lang] = message;
}

/**
 * Sets a local error message.
 *
 * @param key The indentifier key.
 * @param message The error message.
 * @param lang The language of the message.
 */
export function setLocalMessage(
  key: string,
  message: ErrorMessage | undefined,
  lang = '_'
): void {
  if (!local) local = {};
  if (!local[lang]) local[lang] = {};
  local[lang][key] = message;
}

/**
 * Returns a global error message.
 *
 * @param lang The language of the message.
 *
 * @returns The error message.
 */
export function getGlobalMessage(lang = '_'): ErrorMessage | undefined {
  return global?.[lang];
}

/**
 * Returns a local error message.
 *
 * @param key The indentifier key.
 * @param lang The language of the message.
 *
 * @returns The error message.
 */
export function getLocalMessage(
  key: string,
  lang = '_'
): ErrorMessage | undefined {
  return local?.[lang]?.[key];
}
