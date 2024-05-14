import type {
  NullableSchema,
  NullableSchemaAsync,
  NullishSchema,
  NullishSchemaAsync,
  OptionalSchema,
  OptionalSchemaAsync,
} from '../../schemas/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  InferInput,
  MaybePromise,
} from '../../types/index.ts';

/**
 * Infer default type.
 */
export type InferDefault<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
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
      >,
> = TSchema extends
  | NullableSchema<
      BaseSchema<unknown, unknown, BaseIssue<unknown>>,
      infer TDefault
    >
  | NullableSchemaAsync<
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
      infer TDefault
    >
  | NullishSchema<
      BaseSchema<unknown, unknown, BaseIssue<unknown>>,
      infer TDefault
    >
  | NullishSchemaAsync<
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
      infer TDefault
    >
  | OptionalSchema<
      BaseSchema<unknown, unknown, BaseIssue<unknown>>,
      infer TDefault
    >
  | OptionalSchemaAsync<
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
      infer TDefault
    >
  ? TDefault extends InferInput<TSchema> | undefined
    ? TDefault
    : TDefault extends () => MaybePromise<InferInput<TSchema> | undefined>
      ? ReturnType<TDefault>
      : never
  : undefined;

/**
 * Returns the default value of the schema.
 *
 * @param schema The schema to get it from.
 *
 * @returns The default value.
 */
export function getDefault<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(schema: TSchema): InferDefault<TSchema> {
  // @ts-expect-error
  return typeof schema.default === 'function'
    ? // @ts-expect-error
      schema.default()
    : // @ts-expect-error
      schema.default;
}
