import type { Config } from '../../types/index.ts';

/**
 * The global config type.
 */
export type GlobalConfig = Omit<Config, 'message'>;

// Create global configuration store
let store: GlobalConfig | undefined;

/**
 * Sets the global configuration.
 *
 * @param config The configuration.
 */
export function setConfig(config: GlobalConfig | undefined) {
  store = config;
}

/**
 * Returns the global configuration.
 *
 * @param config The config to merge.
 *
 * @returns The configuration.
 */
export function getConfig(config?: Config): Config {
  // Note: The issue is deliberately not constructed with the spread operator
  // for performance reasons
  return {
    lang: config?.lang || store?.lang,
    message: config?.message,
    abortEarly: config?.abortEarly || store?.abortEarly,
    abortPipeEarly: config?.abortPipeEarly || store?.abortPipeEarly,
    skipPipe: config?.skipPipe || store?.skipPipe,
  };
}
