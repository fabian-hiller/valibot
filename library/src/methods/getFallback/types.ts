import type { BaseSchema, BaseSchemaAsync, Output } from '../../types/index.ts';
import type { FallbackInfo } from '../fallback/types.ts';

/**
 * Schema with maybe fallback type.
 */
export interface SchemaWithMaybeFallback<TInput = any, TOutput = TInput>
  extends BaseSchema<TInput, TOutput> {
  /**
   * The optional fallback value.
   */
  fallback?: TOutput | ((info?: FallbackInfo) => TOutput);
}

/**
 * Schema with maybe fallback async type.
 */
export interface SchemaWithMaybeFallbackAsync<TInput = any, TOutput = TInput>
  extends BaseSchemaAsync<TInput, TOutput> {
  /**
   * The optional fallback value.
   */
  fallback?: TOutput | ((info?: FallbackInfo) => TOutput | Promise<TOutput>);
}

/**
 * Fallback value inference type.
 */
export type FallbackValue<
  TSchema extends SchemaWithMaybeFallback | SchemaWithMaybeFallbackAsync
> = TSchema['fallback'] extends Output<TSchema>
  ? TSchema['fallback']
  : TSchema['fallback'] extends () => Output<TSchema>
  ? ReturnType<TSchema['fallback']>
  : TSchema['fallback'] extends () => Promise<Output<TSchema>>
  ? Awaited<ReturnType<TSchema['fallback']>>
  : undefined;
