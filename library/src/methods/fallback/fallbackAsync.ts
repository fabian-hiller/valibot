import type { BaseSchema, BaseSchemaAsync, Output } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';
import type { FallbackInfo } from './types.ts';

/**
 * Returns a fallback value when validating the passed schema failed.
 *
 * @param schema The schema to catch.
 * @param value The fallback value.
 *
 * @returns The passed schema.
 */
export function fallbackAsync<TSchema extends BaseSchema | BaseSchemaAsync>(
  schema: TSchema,
  value: Output<TSchema> | ((info: FallbackInfo) => Output<TSchema>)
): TSchema {
  return {
    ...schema,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async _parse(input, info) {
      const result = await schema._parse(input, info);
      return getOutput(
        result.issues
          ? typeof value === 'function'
            ? (value as (info: FallbackInfo) => Output<TSchema>)({
                input,
                issues: result.issues,
              })
            : value
          : result.output
      );
    },
  };
}
