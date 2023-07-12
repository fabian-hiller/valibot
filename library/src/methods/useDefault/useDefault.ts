import type { BaseSchema, BaseSchemaAsync, Input } from '../../types';

/**
 * Passes the default value to a scheme in case of an undefined input.
 *
 * @param schema The affected scheme.
 * @param value The default value.
 *
 * @returns The passed schema.
 */
export function useDefault<TSchema extends BaseSchema | BaseSchemaAsync>(
  schema: TSchema,
  value: Input<TSchema>
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
    parse(input, info) {
      return schema.parse(input === undefined ? value : input, info);
    },
  };
}
