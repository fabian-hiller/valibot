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
 */
export interface OverrideSchemaContext extends ConversionContext {
  /**
   * The JSON Schema reference ID.
   */
  referenceId: string | undefined;
  /**
   * The Valibot schema to be converted.
   */
  valibotSchema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;
  /**
   * The converted JSON Schema.
   */
  jsonSchema: JSONSchema7;
  /**
   * The errors of the current Valibot schema conversion.
   */
  errors: string[];
}

/**
 * JSON Schema override context interface for actions.
 */
export interface OverrideActionContext {
  /**
   * The Valibot action to be converted.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valibotAction: v.PipeAction<any, any, v.BaseIssue<unknown>>;
  /**
   * The converted JSON Schema.
   */
  jsonSchema: JSONSchema7;
  /**
   * The errors of the current Valibot action conversion.
   */
  errors: string[];
}

/**
 * JSON Schema override context interface for references.
 */
export interface OverrideRefContext extends ConversionContext {
  /**
   * The JSON Schema reference ID.
   */
  referenceId: string;
  /**
   * The Valibot schema to be converted.
   */
  valibotSchema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;
  /**
   * The converted JSON Schema.
   */
  jsonSchema: JSONSchema7;
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
   */
  readonly overrideRef?: (
    context: OverrideRefContext
  ) => string | null | undefined;
}
