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
 * Optional schema async type.
 */
export interface OptionalSchemaAsync<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends DefaultAsync<TWrapped>,
> extends BaseSchemaAsync<
    InferInput<TWrapped> | undefined,
    TDefault extends
      | InferInput<TWrapped>
      | (() => MaybePromise<InferInput<TWrapped>>)
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
  readonly reference: typeof optionalAsync;
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
 * Creates an async optional schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns An async optional schema.
 */
export function optionalAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): OptionalSchemaAsync<TWrapped, undefined>;

/**
 * Creates an async optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An async optional schema.
 */
export function optionalAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TDefault extends DefaultAsync<TWrapped>,
>(
  wrapped: TWrapped,
  default_: TDefault
): OptionalSchemaAsync<TWrapped, TDefault>;

export function optionalAsync(
  wrapped:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  default_?: DefaultAsync<
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
  >
): OptionalSchemaAsync<
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  DefaultAsync<
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
  >
> {
  return {
    kind: 'schema',
    type: 'optional',
    reference: optionalAsync,
    expects: `${wrapped.expects} | undefined`,
    async: true,
    wrapped,
    default: default_,
    async _run(dataset, config) {
      // If value is `undefined`, return dataset or override it with default
      if (dataset.value === undefined) {
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
