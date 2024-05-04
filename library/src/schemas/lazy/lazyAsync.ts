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
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> extends BaseSchemaAsync<
    InferInput<TSchema>,
    InferOutput<TSchema>,
    InferIssue<TSchema>
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
  readonly getter: (input: unknown) => MaybePromise<TSchema>;
}

/**
 * Creates an async lazy schema.
 *
 * @param getter The schema getter.
 *
 * @returns An async lazy schema.
 */
export function lazyAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(getter: (input: unknown) => TSchema): LazySchemaAsync<TSchema> {
  return {
    kind: 'schema',
    type: 'lazy',
    reference: lazyAsync,
    expects: 'unknown',
    async: true,
    getter,
    async _run(dataset, config) {
      return (await this.getter(dataset.value))._run(dataset, config);
    },
  };
}
