import type { BaseSchema, Output } from '../../types/index.ts';
import { schemaResult } from '../../utils/index.ts';
import { getFallback } from '../getFallback/index.ts';
import type { FallbackInfo } from './types.ts';

// TODO: Should we create a Fallback and Default type to simplify the generics?

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
 * Returns a fallback output value when validating the passed schema failed.
 *
 * @param schema The schema to catch.
 * @param fallback The fallback value.
 *
 * @returns The passed schema.
 */
export function fallback<
  TSchema extends BaseSchema,
  const TFallback extends  // TODO: Should we also allow `undefined`
    | Output<TSchema>
    | ((info?: FallbackInfo) => Output<TSchema>)
>(
  schema: TSchema,
  fallback: TFallback
): SchemaWithFallback<TSchema, TFallback> {
  return {
    ...schema,
    fallback,
    _parse(input, config) {
      const result = schema._parse(input, config);
      return result.issues
        ? schemaResult(
            true,
            getFallback(this, { input, issues: result.issues })
          )
        : result;
    },
  };
}
