import type { BaseSchemaAsync, Output } from '../../types.ts';
import { type Issues } from '../../error/index.ts';

/**
 * Returns a fallback value when validating the passed schema failed.
 *
 * @param schema The scheme to catch validation failures from.
 * @param value The fallback value.
 * @param logger A callback that receives the caught issues. Default: console.error
 *
 * @returns The passed async schema.
 */
export function fallbackAsync<TSchema extends BaseSchemaAsync>(
  schema: TSchema,
  value: Output<TSchema>,
  logger?: (err: Issues) => void
): TSchema {
  return {
    ...schema,

    /**
     * Parses the input based on its schema.
     * Tests the result for issues and prints them,
     * with either console.error or the passed logger callback.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output or if validation failed the fallback value.
     */
    async _parse(input, info) {
      const result = await schema._parse(input, info);
      if (!result.issues) {
        return result;
      }

      (logger ?? console.error)(result.issues);
      return { output: value };
    },
  };
}
