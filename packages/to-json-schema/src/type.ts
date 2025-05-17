import type { JSONSchema7 } from 'json-schema';
import type * as v from 'valibot';

/**
 * JSON Schema conversion context interface.
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

/**
 * JSON Schema override context interface for schemas.
 *
 * @beta
 */
export interface OverrideSchemaContext extends ConversionContext {
  /**
   * The JSON Schema reference ID.
   */
  readonly referenceId: string | undefined;
  /**
   * The Valibot schema to be converted.
   */
  readonly valibotSchema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;
  /**
   * The converted JSON Schema.
   */
  readonly jsonSchema: JSONSchema7;
  /**
   * The errors of the current Valibot schema conversion.
   */
  readonly errors: [string, ...string[]] | undefined;
}

/**
 * JSON Schema override context interface for actions.
 *
 * @beta
 */
export interface OverrideActionContext {
  /**
   * The Valibot action to be converted.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly valibotAction: v.PipeAction<any, any, v.BaseIssue<unknown>>;
  /**
   * The converted JSON Schema.
   */
  readonly jsonSchema: JSONSchema7;
  /**
   * The errors of the current Valibot action conversion.
   */
  readonly errors: [string, ...string[]] | undefined;
}

/**
 * JSON Schema override context interface for references.
 *
 * @beta
 */
export interface OverrideRefContext extends ConversionContext {
  /**
   * The JSON Schema reference ID.
   */
  readonly referenceId: string;
  /**
   * The Valibot schema to be converted.
   */
  readonly valibotSchema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;
  /**
   * The converted JSON Schema.
   */
  readonly jsonSchema: JSONSchema7;
}

/**
 * JSON Schema conversion config interface.
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
   * @returns A JSON Schema, if overridden.
   *
   * @beta
   */
  readonly overrideSchema?: (
    context: OverrideSchemaContext
  ) => JSONSchema7 | null | undefined;
  /**
   * Overrides the JSON Schema reference for a specific Valibot action.
   *
   * @param context The conversion context.
   *
   * @returns A JSON Schema, if overridden.
   *
   * @beta
   */
  readonly overrideAction?: (
    context: OverrideActionContext
  ) => JSONSchema7 | null | undefined;
  /**
   * Overrides the JSON Schema reference for a specific reference ID.
   *
   * @param context The conversion context.
   *
   * @returns A reference ID, if overridden.
   *
   * @beta
   */
  readonly overrideRef?: (
    context: OverrideRefContext
  ) => string | null | undefined;
}
