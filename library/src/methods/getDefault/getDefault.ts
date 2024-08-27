import type {
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
  Config,
  Dataset,
  InferInput,
  InferIssue,
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
  | UndefinedableSchema<
      BaseSchema<unknown, unknown, BaseIssue<unknown>>,
      infer TDefault
    >
  | UndefinedableSchemaAsync<
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
      infer TDefault
    >
  ? [TDefault] extends [never]
    ? undefined
    : TDefault extends () => MaybePromise<InferInput<TSchema>>
      ? ReturnType<TDefault>
      : TDefault
  : undefined;

/**
 * Returns the default value of the schema.
 *
 * @param schema The schema to get it from.
 * @param dataset The input dataset if available.
 * @param config The config if available.
 *
 * @returns The default value.
 */
export function getDefault<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  dataset?: Dataset<null | undefined, never>,
  config?: Config<InferIssue<TSchema>>
): InferDefault<TSchema> {
  // @ts-expect-error
  return typeof schema.default === 'function'
    ? // @ts-expect-error
      schema.default(dataset, config)
    : // @ts-expect-error
      schema.default;
}
