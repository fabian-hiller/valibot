import type { BaseSchema, Input } from '../../types.ts';

/**
 * Coerces the input of a scheme to match the required type.
 *
 * @param schema The affected scheme.
 * @param action The coerceation action.
 *
 * @returns The passed schema.
 */
export function coerce<TSchema extends BaseSchema>(
  schema: TSchema,
  action: (value: unknown) => Input<TSchema>
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
      return schema.parse(action(input), info);
    },
  };
}
