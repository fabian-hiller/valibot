import { getGlobalConfig } from '../../storages/index.ts';
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
  TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
> extends BaseSchema<
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
  readonly reference: typeof lazy;
  /**
   * The expected property.
   */
  readonly expects: 'unknown';
  /**
   * The schema getter.
   */
  readonly getter: (input: unknown) => TWrapped;
}

/**
 * Creates a lazy schema.
 *
 * @param getter The schema getter.
 *
 * @returns A lazy schema.
 */
export function lazy<
  const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(getter: (input: unknown) => TWrapped): LazySchema<TWrapped> {
  return {
    kind: 'schema',
    type: 'lazy',
    reference: lazy,
    expects: 'unknown',
    async: false,
    getter,
    '~standard': 1,
    '~vendor': 'valibot',
    '~validate'(dataset, config = getGlobalConfig()) {
      return this.getter(dataset.value)['~validate'](dataset, config);
    },
  };
}
