import type { ObjectSchema } from '../../schemas/object/index.ts';

/**
 * Creates an object schema that passes unknown keys.
 *
 * @param schema A object schema.
 *
 * @returns A object schema.
 */
export function passthrough<TSchema extends ObjectSchema<any>>(
  schema: TSchema
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
      const result = schema._parse(input, info);
      return !result.issues
        ? { output: { ...(input as object), ...result.output } }
        : result;
    },
  };
}
