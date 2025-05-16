import type { JSONSchema7 } from 'json-schema';
import type * as v from 'valibot';

/**
 * JSON Schema conversion config type.
 */
export interface ConversionConfig {
  /**
   * The policy for handling incompatible schemas and actions.
   */
  readonly errorMode?: 'throw' | 'warn' | 'ignore';
  /**
   * The schema definitions for constructing recursive schemas. If not
   * specified, the definitions are generated automatically.
   */
  readonly definitions?: Record<
    string,
    v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
  >;
  /**
   * Overrides the JSON Schema conversion for a specific Valibot schema.
   *
   * @param context The conversion context.
   *
   * @returns The converted JSON Schema.
   */
  readonly overrideSchema?: (context: {
    valibotSchema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;
    jsonSchema: JSONSchema7;
  }) => JSONSchema7;
  /**
   * Overrides the JSON Schema reference for a specific Valibot action.
   *
   * @param context The conversion context.
   *
   * @returns The converted JSON Schema.
   */
  readonly overrideAction?: (context: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    valibotAction: v.PipeAction<any, any, v.BaseIssue<unknown>>;
    jsonSchema: JSONSchema7;
  }) => JSONSchema7;
  /**
   * Overrides the JSON Schema reference for a specific reference ID.
   *
   * @param context The conversion context.
   *
   * @returns A custom reference.
   */
  readonly overrideRef?: (context: {
    refId: string;
    valibotSchema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;
    jsonSchema: JSONSchema7;
  }) => string;
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
