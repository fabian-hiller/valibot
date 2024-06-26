import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  MaybeReadonly,
} from '../../types/index.ts';

/**
 * Intersect issue type.
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
  ? TRest extends readonly [
      InferOption<unknown, unknown>,
      ...InferOption<unknown, unknown>[],
    ]
    ? TInput & InferIntersectInput<TRest>
    : TInput
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
  ? TRest extends readonly [
      InferOption<unknown, unknown>,
      ...InferOption<unknown, unknown>[],
    ]
    ? TOutput & InferIntersectOutput<TRest>
    : TOutput
  : never;
