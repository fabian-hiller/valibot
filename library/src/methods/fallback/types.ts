import type { SchemaIssues, BaseSchema, BaseSchemaAsync } from '../../types/index.ts';

/**
 * Fallback info type.
 */
export type FallbackInfo = {
  input: unknown;
  issues: SchemaIssues;
};

/**
 * Schema with fallback type.
 */
export interface SchemaWithFallback<TInput = any, TOutput = TInput>
  extends BaseSchema<TInput, TOutput> {
  /**
   * The fallback value.
   */
  fallback: TOutput | ((info?: FallbackInfo) => TOutput);
}

/**
 * Schema with fallback async type.
 */
export interface SchemaWithFallbackAsync<TInput = any, TOutput = TInput>
  extends BaseSchemaAsync<TInput, TOutput> {
  /**
   * The fallback value.
   */
  fallback: TOutput | ((info?: FallbackInfo) => TOutput | Promise<TOutput>);
}
