import type { BaseSchemaAsync, Output } from '../../types/index.ts';
import { getOutput } from '../../utils/index.ts';
import { getFallbackAsync } from '../getFallback/index.ts';
import type { FallbackInfo, SchemaWithFallbackAsync } from './types.ts';

/**
 * Returns a fallback value when validating the passed schema failed.
 *
 * @param schema The schema to catch.
 * @param fallback The fallback value.
 *
 * @returns The passed schema.
 */
export function fallbackAsync<
  TSchema extends BaseSchemaAsync,
  const TFallback extends
    | Output<TSchema>
    | ((info?: FallbackInfo) => Output<TSchema> | Promise<Output<TSchema>>)
>(
  schema: TSchema,
  fallback: TFallback
): SchemaWithFallbackAsync<TSchema, TFallback> {
  return {
    ...schema,
    fallback,
    async _parse(input, info) {
      const result = await schema._parse(input, info);
      return getOutput(
        result.issues
          ? await getFallbackAsync(this, { input, issues: result.issues })
          : result.output
      );
    },
  };
}
