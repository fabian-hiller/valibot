import type { BaseSchema, Output } from '../../types/index.ts';
import { schemaResult } from '../../utils/index.ts';
import { getFallback } from '../getFallback/index.ts';
import type { FallbackInfo } from './types.ts';

/**
 * Fallback type.
 */
export type Fallback<TSchema extends BaseSchema> =
  | Output<TSchema>
  | ((info?: FallbackInfo) => Output<TSchema>);

/**
 * Schema with fallback type.
 */
export type SchemaWithFallback<
  TSchema extends BaseSchema = BaseSchema,
  TFallback extends Fallback<TSchema> = Fallback<TSchema>,
> = TSchema & {
  /**
   * The fallback value.
   */
  fallback: TFallback;
};

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
  const TFallback extends Fallback<TSchema>, // TODO: Should we also allow `undefined`
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
