import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  InferInput,
  InferOutput,
  MaybeReadonly,
  UnionToIntersect,
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
 * Infer intersect input type.
 */
export type InferIntersectInput<
  TOptions extends IntersectOptions | IntersectOptionsAsync,
> = UnionToIntersect<InferInput<TOptions[number]>>;

/**
 * Infer intersect output type.
 */
export type InferIntersectOutput<
  TOptions extends IntersectOptions | IntersectOptionsAsync,
> = UnionToIntersect<InferOutput<TOptions[number]>>;
