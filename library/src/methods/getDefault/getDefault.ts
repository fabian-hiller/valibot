import type {
  ExactOptionalSchema,
  ExactOptionalSchemaAsync,
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
  InferIssue,
  UnknownDataset,
} from '../../types/index.ts';

/**
 * Schema with default type.
 */
type SchemaWithDefault =
  | ExactOptionalSchema<
      BaseSchema<unknown, unknown, BaseIssue<unknown>>,
      unknown
    >
  | NullableSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown>
  | NullishSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown>
  | OptionalSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown>
  | UndefinedableSchema<
      BaseSchema<unknown, unknown, BaseIssue<unknown>>,
      unknown
    >;

/**
 * Schema with default async type.
 */
type SchemaWithDefaultAsync =
  | ExactOptionalSchemaAsync<
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
      unknown
    >
  | NullableSchemaAsync<
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
      unknown
    >
  | NullishSchemaAsync<
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
      unknown
    >
  | OptionalSchemaAsync<
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
      unknown
    >
  | UndefinedableSchemaAsync<
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
      unknown
    >;

/**
 * Infer default type.
 */
export type InferDefault<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | SchemaWithDefault
    | SchemaWithDefaultAsync,
> = TSchema extends SchemaWithDefault | SchemaWithDefaultAsync
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TSchema['default'] extends (...args: any) => any
    ? ReturnType<TSchema['default']>
    : TSchema['default']
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
// @__NO_SIDE_EFFECTS__
export function getDefault<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  dataset?: UnknownDataset,
  config?: Config<InferIssue<TSchema>>
): InferDefault<TSchema> {
  // @ts-expect-error
  return typeof schema.default === 'function'
    ? // @ts-expect-error
      schema.default(dataset, config)
    : // @ts-expect-error
      schema.default;
}
