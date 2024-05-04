import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  InferInput,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';

/**
 * Non optional issue type.
 */
export interface NonOptionalIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'non_optional';
  /**
   * The expected input.
   */
  readonly expected: '!undefined';
}

/**
 * Non optional type.
 */
type NonOptional<T> = T extends undefined ? never : T;

/**
 * Infer non optional input type.
 */
export type InferNonOptionalInput<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = NonOptional<InferInput<TWrapped>>;

/**
 * Infer non optional output type.
 */
export type InferNonOptionalOutput<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = NonOptional<InferOutput<TWrapped>>;

/**
 * Infer non optional issue type.
 */
export type InferNonOptionalIssue<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = NonOptionalIssue | Exclude<InferIssue<TWrapped>, { type: 'undefined' }>;
