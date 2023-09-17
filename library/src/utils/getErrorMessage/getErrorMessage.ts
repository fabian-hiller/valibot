import type { ErrorMessage } from '../../types.ts';

/**
 * Returns the final string of the error message.
 *
 * @param error The error message.
 *
 * @returns The error message.
 */
export function getErrorMessage(error: ErrorMessage): string {
  return typeof error === 'function' ? error() : error;
}
