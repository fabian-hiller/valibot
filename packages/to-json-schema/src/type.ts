import type { JSONSchema7 } from 'json-schema';
import type * as v from 'valibot';

/**
 * JSON Schema conversion config type.
 */
export interface ConversionConfig {
  /**
   * Whether to force conversion to JSON Schema even for incompatible schemas and actions.
   */
  force?: boolean;
}

/**
 * JSON Schema conversion context type.
 */
export interface ConversionContext {
  /**
   * The JSON Schema definitions.
   */
  definitions: Record<string, JSONSchema7>;
  /**
   * The JSON Schema reference map.
   */
  referenceMap: Map<
    v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
    string
  >;
}
