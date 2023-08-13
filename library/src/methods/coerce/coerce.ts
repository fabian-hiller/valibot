import type { BaseSchema, Input } from '../../types.ts';

/**
 * Coerces the input of a schema to match the required type.
 *
 * @param schema The affected schema.
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
    _parse(input, info) {
      return schema._parse(action(input), info);
    },
  };
}
