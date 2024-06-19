import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  InferInput,
  InferOutput,
} from '../../types/index.ts';

/**
 * Map issue type.
 */
export interface MapIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'map';
  /**
   * The expected property.
   */
  readonly expected: 'Map';
}

/**
 * Infer map input type.
 */
export type InferMapInput<
  TKey extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TValue extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = Map<InferInput<TKey>, InferInput<TValue>>;

/**
 * Infer map output type.
 */
export type InferMapOutput<
  TKey extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TValue extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = Map<InferOutput<TKey>, InferOutput<TValue>>;
