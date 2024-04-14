import type {
  BaseIssue,
  BaseSchema,
  InferInput,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';

/**
 * Getter type.
 */
export type Getter = (
  input: unknown
) => BaseSchema<unknown, unknown, BaseIssue<unknown>>;

/**
 * Lazy schema type.
 */
export interface LazySchema<TGetter extends Getter>
  extends BaseSchema<
    InferInput<ReturnType<TGetter>>,
    InferOutput<ReturnType<TGetter>>,
    InferIssue<ReturnType<TGetter>>
  > {
  /**
   * The schema type.
   */
  readonly type: 'lazy';
  /**
   * The expected property.
   */
  readonly expects: 'unknown';
  /**
   * The schema getter.
   */
  readonly getter: TGetter;
}

/**
 * Creates a lazy schema.
 *
 * @param getter The schema getter.
 *
 * @returns A lazy schema.
 */
export function lazy<TGetter extends Getter>(
  getter: TGetter
): LazySchema<TGetter> {
  return {
    kind: 'schema',
    type: 'lazy',
    expects: 'unknown',
    async: false,
    getter,
    _run(dataset, config) {
      return this.getter(dataset.value)._run(dataset, config);
    },
  };
}
