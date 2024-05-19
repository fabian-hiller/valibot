import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  InferInput,
  InferIssue,
  InferOutput,
  NonNullish,
} from '../../types/index.ts';
import type {
  UnionIssue,
  UnionOptions,
  UnionOptionsAsync,
  UnionSchema,
  UnionSchemaAsync,
} from '../union/index.ts';

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
   * The expected property.
   */
  readonly expected: '!null & !undefined';
}

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
> =
  // FIXME: For schemas that transform the input to `null` or `undefined`,
  // this implementation may result in an incorrect output type
  NonNullish<InferOutput<TWrapped>>;

/**
 * Infer non nullish issue type.
 */
export type InferNonNullishIssue<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = TWrapped extends
  | UnionSchema<
      UnionOptions,
      ErrorMessage<UnionIssue<BaseIssue<unknown>>> | undefined
    >
  | UnionSchemaAsync<
      UnionOptionsAsync,
      ErrorMessage<UnionIssue<BaseIssue<unknown>>> | undefined
    >
  ?
      | Exclude<InferIssue<TWrapped>, { type: 'null' | 'undefined' | 'union' }>
      | UnionIssue<InferNonNullishIssue<TWrapped['options'][number]>>
  : Exclude<InferIssue<TWrapped>, { type: 'null' | 'undefined' }>;
