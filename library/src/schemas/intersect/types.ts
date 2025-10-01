import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  MaybeReadonly,
} from '../../types/index.ts';

/**
 * Intersect issue interface.
 */
export interface IntersectIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'intersect';
  /**
   * The expected property.
   */
  readonly expected: string;
}

/**
 * Intersect options type.
 */
export type IntersectOptions = MaybeReadonly<
  BaseSchema<unknown, unknown, BaseIssue<unknown>>[]
>;

/**
 * Intersect options async type.
 */
export type IntersectOptionsAsync = MaybeReadonly<
  (
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
  )[]
>;

/**
 * Infer option type.
 */
type InferOption<TInput, TOutput> =
  | BaseSchema<TInput, TOutput, BaseIssue<unknown>>
  | BaseSchemaAsync<TInput, TOutput, BaseIssue<unknown>>;

/**
 * Infer intersect input type.
 */
export type InferIntersectInput<
  TOptions extends IntersectOptions | IntersectOptionsAsync,
> = TOptions extends readonly [
  InferOption<infer TInput, unknown>,
  ...infer TRest,
]
  ? TRest extends InferOption<unknown, unknown>[]
    ? TInput extends NonNullable<TInput>
      ?
          | TInput
          | InferIntersectInput<TRest>
          | (TInput & InferIntersectInput<TRest>)
      :
          | InferIntersectInput<TRest>
          | (NonNullable<TInput> & InferIntersectInput<TRest>)
    : never
  : never;

/**
 * Infer intersect output type.
 */
export type InferIntersectOutput<
  TOptions extends IntersectOptions | IntersectOptionsAsync,
> = TOptions extends readonly [
  InferOption<unknown, infer TOutput>,
  ...infer TRest,
]
  ? TRest extends InferOption<unknown, unknown>[]
    ? TOutput extends NonNullable<TOutput>
      ?
          | TOutput
          | InferIntersectOutput<TRest>
          | (TOutput & InferIntersectOutput<TRest>)
      :
          | InferIntersectOutput<TRest>
          | (NonNullable<TOutput> & InferIntersectOutput<TRest>)
    : never
  : never;
