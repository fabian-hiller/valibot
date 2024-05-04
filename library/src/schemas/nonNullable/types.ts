import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  InferInput,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';

/**
 * Non nullable issue type.
 */
export interface NonNullableIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'non_nullable';
  /**
   * The expected input.
   */
  readonly expected: '!null';
}

/**
 * Non nullable type.
 */
type NonNullable<T> = T extends null ? never : T;

/**
 * Infer non nullable input type.
 */
export type InferNonNullableInput<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = NonNullable<InferInput<TWrapped>>;

/**
 * Infer non nullable output type.
 */
export type InferNonNullableOutput<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = NonNullable<InferOutput<TWrapped>>;

/**
 * Infer non nullable issue type.
 */
export type InferNonNullableIssue<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = NonNullableIssue | Exclude<InferIssue<TWrapped>, { type: 'null' }>;
