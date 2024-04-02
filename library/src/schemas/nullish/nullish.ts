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
 * Nullish schema type.
 */
export interface NullishSchema<
  TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends Default<TWrapped>,
> extends BaseSchema<
    InferInput<TWrapped> | null | undefined,
    TDefault extends InferInput<TWrapped> | (() => InferInput<TWrapped>)
      ? InferOutput<TWrapped>
      : InferOutput<TWrapped> | null | undefined,
    InferIssue<TWrapped>
  > {
  /**
   * The schema type.
   */
  readonly type: 'nullish';
  /**
   * The expected property.
   */
  readonly expects: `${TWrapped['expects']} | null | undefined`;
  /**
   * The wrapped schema.
   */
  readonly wrapped: TWrapped;
  /**
   * Returns the default value.
   */
  readonly default: TDefault;
}

/**
 * Creates a nullish schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A nullish schema.
 */
export function nullish<
  const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): NullishSchema<TWrapped, undefined>;

/**
 * Creates a nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A nullish schema.
 */
export function nullish<
  const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  const TDefault extends Default<TWrapped>,
>(wrapped: TWrapped, default_: TDefault): NullishSchema<TWrapped, TDefault>;

export function nullish(
  wrapped: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  default_?: Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>>
): NullishSchema<
  BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>>
> {
  return {
    kind: 'schema',
    type: 'nullish',
    expects: `${wrapped.expects} | null | undefined`,
    async: false,
    wrapped,
    default: default_,
    _run(dataset, config) {
      // If value is `null` or `undefined`, return dataset or override it with
      // default
      if (dataset.value === null || dataset.value === undefined) {
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
