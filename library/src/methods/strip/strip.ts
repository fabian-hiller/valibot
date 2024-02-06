import type {
  ObjectEntries,
  ObjectSchema,
} from '../../schemas/object/index.ts';

/**
 * Creates an object schema that strips unknown keys.
 *
 * @deprecated Use `object` without `rest` argument instead.
 *
 * @param schema A object schema.
 *
 * @returns A object schema.
 */
export function strip<TSchema extends ObjectSchema<ObjectEntries, undefined>>(
  schema: TSchema
): TSchema {
  // Create cached keys
  let cachedKeys: string[];

  // Create and return object schema
  return {
    ...schema,
    _parse(input, config) {
      // Get parse result of schema
      const result = schema._parse(input, config);

      // If result is typed, strip unknown keys
      if (result.typed) {
        // Cache object keys lazy
        cachedKeys = cachedKeys ?? Object.keys(schema.entries);

        // Strip unknown keys
        const output: Record<string, any> = {};
        for (const key of cachedKeys) {
          output[key] = result.output[key as keyof typeof result.output];
        }

        // Overwrite output
        result.output = output;
      }

      // Return result if there are issues
      return result;
    },
  };
}
