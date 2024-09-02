import type * as v from 'valibot';

/**
 * JSON Schema config type.
 */
export interface JsonSchemaConfig {
  /**
   * Whether to force conversion to JSON Schema even for incompatible schemas and actions.
   */
  force?: boolean;
  /**
   * The name of the definitions property used. Defaults to "$defs".
   */
  definitionPath?: '$defs' | 'definitions';
  /**
   * Map schemas to definition names.
   */
  definitions?: Record<
    string,
    v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
  >;
}
