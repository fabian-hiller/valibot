import type {
  ObjectEntries,
  ObjectSchema,
} from '../../schemas/object/index.ts';
import type { ErrorMessage } from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Creates a strict object schema that throws an error if an input contains
 * unknown keys.
 *
 * @deprecated Use `object` with `rest` argument instead.
 *
 * @param schema A object schema.
 * @param error The error message.
 *
 * @returns A strict object schema.
 */
export function strict<TSchema extends ObjectSchema<ObjectEntries, undefined>>(
  schema: TSchema,
  error?: ErrorMessage
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
      return !result.issues &&
        Object.keys(input as object).some((key) => !(key in schema.entries))
        ? getSchemaIssues(
            info,
            'object',
            'strict',
            error || 'Invalid keys',
            input
          )
        : result;
    },
  };
}
