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
 * Optional schema type.
 */
export interface OptionalSchema<
  TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends Default<TWrapped>,
> extends BaseSchema<
    InferInput<TWrapped> | undefined,
    TDefault extends InferInput<TWrapped> | (() => InferInput<TWrapped>)
      ? InferOutput<TWrapped>
      : InferOutput<TWrapped> | undefined,
    InferIssue<TWrapped>
  > {
  /**
   * The schema type.
   */
  readonly type: 'optional';
  /**
   * The schema reference.
   */
  readonly reference: typeof optional;
  /**
   * The expected property.
   */
  readonly expects: `${TWrapped['expects']} | undefined`;
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
 * Creates a optional schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A optional schema.
 */
export function optional<
  const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): OptionalSchema<TWrapped, undefined>;

/**
 * Creates a optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A optional schema.
 */
export function optional<
  const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  const TDefault extends Default<TWrapped>,
>(wrapped: TWrapped, default_: TDefault): OptionalSchema<TWrapped, TDefault>;

export function optional(
  wrapped: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  default_?: Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>>
): OptionalSchema<
  BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>>
> {
  return {
    kind: 'schema',
    type: 'optional',
    reference: optional,
    expects: `${wrapped.expects} | undefined`,
    async: false,
    wrapped,
    default: default_,
    _run(dataset, config) {
      // If value is `undefined`, return dataset or override it with default
      if (dataset.value === undefined) {
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
