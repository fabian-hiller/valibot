import type {
  BaseIssue,
  BaseSchema,
  InferInput,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';

/**
 * Lazy schema type.
 */
export interface LazySchema<
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
> extends BaseSchema<
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
  readonly reference: typeof lazy;
  /**
   * The expected property.
   */
  readonly expects: 'unknown';
  /**
   * The schema getter.
   */
  readonly getter: (input: unknown) => TSchema;
}

/**
 * Creates a lazy schema.
 *
 * @param getter The schema getter.
 *
 * @returns A lazy schema.
 */
export function lazy<
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(getter: (input: unknown) => TSchema): LazySchema<TSchema> {
  return {
    kind: 'schema',
    type: 'lazy',
    reference: lazy,
    expects: 'unknown',
    async: false,
    getter,
    _run(dataset, config) {
      return this.getter(dataset.value)._run(dataset, config);
    },
  };
}
