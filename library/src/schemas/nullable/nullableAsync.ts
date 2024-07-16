import { getDefault } from '../../methods/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  Dataset,
  DefaultAsync,
  InferInput,
  InferIssue,
} from '../../types/index.ts';
import type { InferNullableOutput } from './types.ts';

/**
 * Nullable schema async type.
 */
export interface NullableSchemaAsync<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends DefaultAsync<TWrapped, null>,
> extends BaseSchemaAsync<
    InferInput<TWrapped> | null,
    InferNullableOutput<TWrapped, TDefault>,
    InferIssue<TWrapped>
  > {
  /**
   * The schema type.
   */
  readonly type: 'nullable';
  /**
   * The schema reference.
   */
  readonly reference: typeof nullableAsync;
  /**
   * The expected property.
   */
  readonly expects: `${TWrapped['expects']} | null`;
  /**
   * The wrapped schema.
   */
  readonly wrapped: TWrapped;
  /**
   * The default value.
   */
  readonly default: TDefault;
}

/**
 * Creates a nullable schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A nullable schema.
 */
export function nullableAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): NullableSchemaAsync<TWrapped, never>;

/**
 * Creates a nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A nullable schema.
 */
export function nullableAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TDefault extends DefaultAsync<TWrapped, null>,
>(
  wrapped: TWrapped,
  default_: TDefault
): NullableSchemaAsync<TWrapped, TDefault>;

export function nullableAsync(
  wrapped:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  ...args: unknown[]
): NullableSchemaAsync<
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  unknown
> {
  // Create schema object
  // @ts-expect-error
  const schema: NullableSchemaAsync<
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
    unknown
  > = {
    kind: 'schema',
    type: 'nullable',
    reference: nullableAsync,
    expects: `${wrapped.expects} | null`,
    async: true,
    wrapped,
    async _run(dataset, config) {
      // If value is `null`, override it with default or return dataset
      if (dataset.value === null) {
        // If default is specified, override value of dataset
        if ('default' in this) {
          dataset.value = await getDefault(
            this,
            dataset as Dataset<null, never>,
            config
          );
        }

        // If value is still `null`, return dataset
        if (dataset.value === null) {
          dataset.typed = true;
          return dataset;
        }
      }

      // Otherwise, return dataset of wrapped schema
      return this.wrapped._run(dataset, config);
    },
  };

  // Add default if specified
  if (0 in args) {
    // @ts-expect-error
    schema.default = args[0];
  }

  // Return schema object
  return schema;
}
