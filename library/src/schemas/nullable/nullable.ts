import { getDefault } from '../../methods/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  Default,
  InferInput,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';

/**
 * Nullable schema type.
 */
export interface NullableSchema<
  TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends Default<TWrapped>,
> extends BaseSchema<
    InferInput<TWrapped> | null,
    TDefault extends InferInput<TWrapped> | (() => InferInput<TWrapped>)
      ? InferOutput<TWrapped>
      : InferOutput<TWrapped> | null,
    InferIssue<TWrapped>
  > {
  /**
   * The schema type.
   */
  readonly type: 'nullable';
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
>(wrapped: TWrapped): NullableSchema<TWrapped, undefined>;

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
  const TDefault extends Default<TWrapped>,
>(wrapped: TWrapped, default_: TDefault): NullableSchema<TWrapped, TDefault>;

export function nullable(
  wrapped: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  default_?: Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>>
): NullableSchema<
  BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>>
> {
  return {
    kind: 'schema',
    type: 'nullable',
    expects: `${wrapped.expects} | null`,
    async: false,
    wrapped,
    default: default_,
    _run(dataset, config) {
      // If value is `null`, return dataset or override it with default
      if (dataset.value === null) {
        const override = getDefault(this);
        if (override === undefined) {
          dataset.typed = true;
          return dataset;
        }
        dataset.value = override;
      }

      // Otherwise, return dataset of wrapped schema
      return this.wrapped._run(dataset, config);
    },
  };
}
