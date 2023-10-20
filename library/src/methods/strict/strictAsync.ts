import type {
  ObjectEntriesAsync,
  ObjectSchemaAsync,
} from '../../schemas/object/index.ts';
import type { ErrorMessage } from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Creates a strict async object schema that throws an error if an input
 * contains unknown keys.
 *
 * @deprecated Use `objectAsync` with `rest` argument instead.
 *
 * @param schema A object schema.
 * @param error The error message.
 *
 * @returns A strict object schema.
 */
export function strictAsync<
  TSchema extends ObjectSchemaAsync<ObjectEntriesAsync, undefined>
>(schema: TSchema, error?: ErrorMessage): TSchema {
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
      return !result.issues &&
        Object.keys(input as object).some(
          (key) => !(key in schema.object.entries)
        )
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
