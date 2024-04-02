import type { BaseIssue, Config } from '../../types/index.ts';

/**
 * The global config type.
 */
export type GlobalConfig = Omit<Config<never>, 'message' | 'skipPipe'>;

// Create global configuration store
let store: GlobalConfig | undefined;

/**
 * Sets the global configuration.
 *
 * @param config The configuration.
 */
export function setGlobalConfig(config: GlobalConfig) {
  store = { ...store, ...config };
}

/**
 * Returns the global configuration.
 *
 * @param config The config to merge.
 *
 * @returns The configuration.
 */
export function getGlobalConfig<const TIssue extends BaseIssue<unknown>>(
  config?: Config<TIssue>
): Config<TIssue> {
  // Note: The configuration is deliberately not constructed with the spread
  // operator for performance reasons
  return {
    lang: config?.lang ?? store?.lang,
    message: config?.message,
    abortEarly: config?.abortEarly ?? store?.abortEarly,
    abortPipeEarly: config?.abortPipeEarly ?? store?.abortPipeEarly,
    skipPipe: config?.skipPipe,
  };
}

/**
 * Deletes the global configuration.
 */
export function deleteGlobalConfig() {
  store = undefined;
}
