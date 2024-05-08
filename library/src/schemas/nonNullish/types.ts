import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  InferInput,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';

/**
 * Non nullish issue type.
 */
export interface NonNullishIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'non_nullish';
  /**
   * The expected input.
   */
  readonly expected: '!null & !undefined';
}

/**
 * Non nullish type.
 */
type NonNullish<T> = T extends null | undefined ? never : T;

/**
 * Infer non nullish input type.
 */
export type InferNonNullishInput<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = NonNullish<InferInput<TWrapped>>;

/**
 * Infer non nullish output type.
 */
export type InferNonNullishOutput<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = NonNullish<InferOutput<TWrapped>>;

/**
 * Infer non nullish issue type.
 */
export type InferNonNullishIssue<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = Exclude<InferIssue<TWrapped>, { type: 'null' | 'undefined' }>;
