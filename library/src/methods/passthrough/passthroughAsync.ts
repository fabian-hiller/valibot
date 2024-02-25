import type {
  ObjectEntriesAsync,
  ObjectSchemaAsync,
} from '../../schemas/object/index.ts';

/**
 * Creates an object schema that passes unknown keys.
 *
 * @deprecated Use `objectAsync` with `rest` argument instead.
 *
 * @param schema A object schema.
 *
 * @returns A object schema.
 */
export function passthroughAsync<
  TSchema extends ObjectSchemaAsync<ObjectEntriesAsync, undefined>,
>(schema: TSchema): TSchema {
  return {
    ...schema,
    async _parse(input, config) {
      const result = await schema._parse(input, config);
      if (result.typed) {
        result.output = { ...(input as object), ...result.output };
      }
      return result;
    },
  };
}
