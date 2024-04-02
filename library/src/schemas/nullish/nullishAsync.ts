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
 * Nullish schema async type.
 */
export interface NullishSchemaAsync<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends DefaultAsync<TWrapped>,
> extends BaseSchemaAsync<
    InferInput<TWrapped> | null | undefined,
    TDefault extends
      | InferInput<TWrapped>
      | (() => MaybePromise<InferInput<TWrapped>>)
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
   * Retutns the default value.
   */
  readonly default: TDefault;
}

/**
 * Creates an async nullish schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns An async nullish schema.
 */
export function nullishAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): NullishSchemaAsync<TWrapped, undefined>;

/**
 * Creates an async nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An async nullish schema.
 */
export function nullishAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TDefault extends DefaultAsync<TWrapped>,
>(
  wrapped: TWrapped,
  default_: TDefault
): NullishSchemaAsync<TWrapped, TDefault>;

export function nullishAsync(
  wrapped:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  default_?: DefaultAsync<
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
  >
): NullishSchemaAsync<
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  DefaultAsync<
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
  >
> {
  return {
    kind: 'schema',
    type: 'nullish',
    expects: `${wrapped.expects} | null | undefined`,
    async: true,
    wrapped,
    default: default_,
    async _run(dataset, config) {
      // If value is `null` or `undefined`, return dataset or override it with
      // default
      if (dataset.value === null || dataset.value === undefined) {
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
