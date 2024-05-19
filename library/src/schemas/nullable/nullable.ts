import { getDefault } from '../../methods/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  Dataset,
  Default,
  DefaultValue,
  InferInput,
  InferIssue,
  InferOutput,
  NonNullable,
} from '../../types/index.ts';

/**
 * Nullable schema type.
 */
export interface NullableSchema<
  TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends Default<TWrapped, null>,
> extends BaseSchema<
    InferInput<TWrapped> | null,
    [TDefault] extends [never]
      ? InferOutput<TWrapped> | null
      : // FIXME: For schemas that transform the input to `null`, this
        // implementation may result in an incorrect output type
        NonNullable<InferOutput<TWrapped>> | DefaultValue<TDefault>,
    InferIssue<TWrapped>
  > {
  /**
   * The schema type.
   */
  readonly type: 'nullable';
  /**
   * The schema reference.
   */
  readonly reference: typeof nullable;
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
export function nullable<
  const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): NullableSchema<TWrapped, never>;

/**
 * Creates a nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A nullable schema.
 */
export function nullable<
  const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends Default<TWrapped, null>,
>(wrapped: TWrapped, default_: TDefault): NullableSchema<TWrapped, TDefault>;

export function nullable(
  wrapped: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  ...args: unknown[]
): NullableSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown> {
  // Create schema object
  // @ts-expect-error
  const schema: NullableSchema<
    BaseSchema<unknown, unknown, BaseIssue<unknown>>,
    unknown
  > = {
    kind: 'schema',
    type: 'nullable',
    reference: nullable,
    expects: `${wrapped.expects} | null`,
    async: false,
    wrapped,
    _run(dataset, config) {
      // If value is `null`, override it with default or return dataset
      if (dataset.value === null) {
        // If default is specified, override value of dataset
        if ('default' in this) {
          dataset.value = getDefault(
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
