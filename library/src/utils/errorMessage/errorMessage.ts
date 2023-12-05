import type { ErrorMessage } from '../../types/index.ts';

/**
 * Returns the final string of the error message.
 *
 * @param message The error message.
 *
 * @returns The error message.
 */
export function errorMessage(message: ErrorMessage): string {
  return typeof message === 'function' ? message() : message;
}
