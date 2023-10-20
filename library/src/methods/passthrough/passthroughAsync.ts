import type {
  ObjectEntriesAsync,
  ObjectSchemaAsync,
} from '../../schemas/object/index.ts';
import { getOutput } from '../../utils/index.ts';

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
  TSchema extends ObjectSchemaAsync<ObjectEntriesAsync, undefined>
>(schema: TSchema): TSchema {
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
      return !result.issues
        ? getOutput({ ...(input as object), ...result.output })
        : result;
    },
  };
}
