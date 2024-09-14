import type { JSONSchema7 } from 'json-schema';
import type * as v from 'valibot';

/**
 * JSON Schema conversion config type.
 */
export interface ConversionConfig {
  /**
   * Whether to force conversion to JSON Schema even for incompatible schemas
   * and actions.
   */
  readonly force?: boolean;
  /**
   * The schema definitions for constructing recursive schemas. If not
   * specified, the definitions are generated automatically.
   */
  readonly definitions?: Record<
    string,
    v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
  >;
}

/**
 * JSON Schema conversion context type.
 */
export interface ConversionContext {
  /**
   * The JSON Schema definitions.
   */
  readonly definitions: Record<string, JSONSchema7>;
  /**
   * The JSON Schema reference map.
   */
  readonly referenceMap: Map<
    v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
    string
  >;
  /**
   * The lazy schema getter map.
   */
  readonly getterMap: Map<
    (input: unknown) => v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
    v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
  >;
}
