import type { ConversionConfig } from '../type.ts';

/**
 * Throws an error or logs a warning based on the configuration.
 *
 * @param message The message to throw or log.
 * @param config The conversion configuration.
 */
export function throwOrWarn(
  message: string,
  config: ConversionConfig | undefined
): void {
  if (!config?.force) {
    throw new Error(message);
  }
  console.warn(message);
}
