import {
  objectAsync,
  type ObjectEntriesAsync,
  type ObjectSchemaAsync,
} from '../../schemas/object/index.ts';
import { schemaIssue } from '../../utils/index.ts';

/**
 * Creates a strict async object schema that throws an error if an input
 * contains unknown keys.
 *
 * @deprecated Use `objectAsync` with `rest` argument instead.
 *
 * @param schema A object schema.
 *
 * @returns A strict object schema.
 */
export function strictAsync<
  TSchema extends ObjectSchemaAsync<ObjectEntriesAsync, undefined>,
>(schema: TSchema): TSchema {
  return {
    ...schema,
    async _parse(input, config) {
      const result = await schema._parse(input, config);
      return !result.issues &&
        Object.keys(input as object).some((key) => !(key in schema.entries))
        ? schemaIssue(this, objectAsync, input, config)
        : result;
    },
  };
}
