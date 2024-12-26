import type {
  NonNullableIssue,
  NonNullableSchema,
  NonNullableSchemaAsync,
  NonNullishIssue,
  NonNullishSchema,
  NonNullishSchemaAsync,
  NonOptionalIssue,
  NonOptionalSchema,
  NonOptionalSchemaAsync,
  NullableSchema,
  NullableSchemaAsync,
  NullishSchema,
  NullishSchemaAsync,
  OptionalSchema,
  OptionalSchemaAsync,
  UndefinedableSchema,
  UndefinedableSchemaAsync,
} from '../../schemas/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
} from '../../types/index.ts';

/**
 * Unwraps the wrapped schema.
 *
 * @param schema The schema to be unwrapped.
 *
 * @returns The unwrapped schema.
 */
// @__NO_SIDE_EFFECTS__
export function unwrap<
  TSchema extends
    | NonNullableSchema<
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        ErrorMessage<NonNullableIssue> | undefined
      >
    | NonNullableSchemaAsync<
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        ErrorMessage<NonNullableIssue> | undefined
      >
    | NonNullishSchema<
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        ErrorMessage<NonNullishIssue> | undefined
      >
    | NonNullishSchemaAsync<
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        ErrorMessage<NonNullishIssue> | undefined
      >
    | NonOptionalSchema<
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        ErrorMessage<NonOptionalIssue> | undefined
      >
    | NonOptionalSchemaAsync<
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        ErrorMessage<NonOptionalIssue> | undefined
      >
    | NullableSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown>
    | NullableSchemaAsync<
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        unknown
      >
    | NullishSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown>
    | NullishSchemaAsync<
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        unknown
      >
    | OptionalSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown>
    | OptionalSchemaAsync<
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        unknown
      >
    | UndefinedableSchema<
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        unknown
      >
    | UndefinedableSchemaAsync<
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        unknown
      >,
>(schema: TSchema): TSchema['wrapped'] {
  return schema.wrapped;
}
