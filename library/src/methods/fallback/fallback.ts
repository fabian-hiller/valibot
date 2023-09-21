import type { BaseSchema, Output } from '../../types.ts';
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
export function fallback<TSchema extends BaseSchema>(
  schema: TSchema,
  value: Output<TSchema> | ((info?: FallbackInfo) => Output<TSchema>)
): TSchema {
  return {
    ...schema,

    /**
     * The fallback value
     */
    get fallback() {
      return typeof value === 'function'
        ? (value as () => Output<TSchema>)()
        : value;
    },

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
      const result = schema._parse(input, info);
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
