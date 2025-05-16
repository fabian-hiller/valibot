import type { ConversionConfig } from '../type.ts';
import { handleError } from './handleError.ts';

/**
 * Throws an error or log warnings based on the configuration.
 *
 * @param errors The message to throw or log.
 * @param config The conversion configuration.
 */
export function handleErrors(
  errors: string[],
  config: ConversionConfig | undefined
): void {
  for (const message of errors) {
    handleError(message, config);
  }
}
