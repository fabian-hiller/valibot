import { getDefault } from '../../methods/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  Default,
  InferInput,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';
import { _getStandardProps } from '../../utils/index.ts';

/**
 * Optional schema interface.
 */
export interface OptionalSchema<
  TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends Default<TWrapped, undefined>,
> extends BaseSchema<
    InferInput<TWrapped>,
    InferOutput<TWrapped>,
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
  readonly expects: TWrapped['expects'];
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
  const TDefault extends Default<TWrapped, undefined>,
>(wrapped: TWrapped, default_: TDefault): OptionalSchema<TWrapped, TDefault>;

// @__NO_SIDE_EFFECTS__
export function optional(
  wrapped: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  default_?: unknown
): OptionalSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown> {
  return {
    kind: 'schema',
    type: 'optional',
    reference: optional,
    expects: wrapped.expects,
    async: false,
    wrapped,
    default: default_,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {
      // If value is `undefined` and default is specified, override value
      if (dataset.value === undefined && this.default !== undefined) {
        dataset.value = getDefault(this, dataset, config);
      }

      // Otherwise, return dataset of wrapped schema
      return this.wrapped['~run'](dataset, config);
    },
  };
}
