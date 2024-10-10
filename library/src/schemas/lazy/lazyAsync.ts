import { getGlobalConfig } from '../../storages/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  InferInput,
  InferIssue,
  InferOutput,
  MaybePromise,
} from '../../types/index.ts';

/**
 * Lazy schema async type.
 */
export interface LazySchemaAsync<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> extends BaseSchemaAsync<
    InferInput<TWrapped>,
    InferOutput<TWrapped>,
    InferIssue<TWrapped>
  > {
  /**
   * The schema type.
   */
  readonly type: 'lazy';
  /**
   * The schema reference.
   */
  readonly reference: typeof lazyAsync;
  /**
   * The expected property.
   */
  readonly expects: 'unknown';
  /**
   * The schema getter.
   */
  readonly getter: (input: unknown) => MaybePromise<TWrapped>;
}

/**
 * Creates a lazy schema.
 *
 * @param getter The schema getter.
 *
 * @returns A lazy schema.
 */
export function lazyAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(
  getter: (input: unknown) => MaybePromise<TWrapped>
): LazySchemaAsync<TWrapped> {
  return {
    kind: 'schema',
    type: 'lazy',
    reference: lazyAsync,
    expects: 'unknown',
    async: true,
    getter,
    '~standard': 1,
    '~vendor': 'valibot',
    async '~validate'(dataset, config = getGlobalConfig()) {
      return (await this.getter(dataset.value))['~validate'](dataset, config);
    },
  };
}
