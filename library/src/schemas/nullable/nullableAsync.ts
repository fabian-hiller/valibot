import { getDefaultAsync } from '../../methods/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  DefaultAsync,
  InferInput,
  InferIssue,
  InferOutput,
  MaybePromise,
} from '../../types/index.ts';

/**
 * Nullable schema async type.
 */
export interface NullableSchemaAsync<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends DefaultAsync<TWrapped>,
> extends BaseSchemaAsync<
    InferInput<TWrapped> | null,
    TDefault extends
      | InferInput<TWrapped>
      | (() => MaybePromise<InferInput<TWrapped>>)
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
   * Returns the default value.
   */
  readonly default: TDefault;
}

/**
 * Creates an async nullable schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns An async nullable schema.
 */
export function nullableAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): NullableSchemaAsync<TWrapped, undefined>;

/**
 * Creates an async nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An async nullable schema.
 */
export function nullableAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TDefault extends DefaultAsync<TWrapped>,
>(
  wrapped: TWrapped,
  default_: TDefault
): NullableSchemaAsync<TWrapped, TDefault>;

export function nullableAsync(
  wrapped:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  default_?: DefaultAsync<
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
  >
): NullableSchemaAsync<
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  DefaultAsync<
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
  >
> {
  return {
    kind: 'schema',
    type: 'nullable',
    expects: `${wrapped.expects} | null`,
    async: true,
    wrapped,
    default: default_,
    async _run(dataset, config) {
      // If value is `null`, return dataset or override it with default
      if (dataset.value === null) {
        const override = await getDefaultAsync(this);
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
