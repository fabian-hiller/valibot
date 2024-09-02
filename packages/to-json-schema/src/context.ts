import type { JSONSchema7 } from 'json-schema';
import type * as v from 'valibot';
import type { JsonSchemaConfig } from './type.ts';

/**
 * Conversion context
 */
export interface Context {
  /** JSON schema conversion config */
  config: Required<JsonSchemaConfig>;
  /** Map schema to definitions path */
  definitionsPathMap: Map<v.GenericSchema, string>;
  /** Map schemas to definition names */
  definitions: Record<string, JSONSchema7>;
}

/**
 * Initialize context with default value.
 *
 * @param config Config
 *
 * @returns Initialized conversion context
 */
export function createContext(config?: JsonSchemaConfig | undefined): Context {
  return {
    config: {
      force: !!config?.force,
      definitionPath: config?.definitionPath || '$defs',
      definitions: config?.definitions || {},
    },
    definitions: {},
    definitionsPathMap: new Map(),
  };
}
