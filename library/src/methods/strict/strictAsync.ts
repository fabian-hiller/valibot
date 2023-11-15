import type {
  ObjectEntriesAsync,
  ObjectSchemaAsync,
} from '../../schemas/object/index.ts';
import type { ErrorMessage } from '../../types/index.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Creates a strict async object schema that throws an error if an input
 * contains unknown keys.
 *
 * @deprecated Use `objectAsync` with `rest` argument instead.
 *
 * @param schema A object schema.
 * @param message The error message.
 *
 * @returns A strict object schema.
 */
export function strictAsync<
  TSchema extends ObjectSchemaAsync<ObjectEntriesAsync, undefined>
>(schema: TSchema, message?: ErrorMessage): TSchema {
  return {
    ...schema,
    message,
    async _parse(input, info) {
      const result = await schema._parse(input, info);
      return !result.issues &&
        Object.keys(input as object).some((key) => !(key in schema.entries))
        ? getSchemaIssues(info, 'object', 'strict', this.message, input)
        : result;
    },
  };
}
