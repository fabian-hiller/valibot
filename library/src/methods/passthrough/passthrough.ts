import type {
  ObjectEntries,
  ObjectSchema,
} from '../../schemas/object/index.ts';

/**
 * Creates an object schema that passes unknown keys.
 *
 * @deprecated Use `object` with `rest` argument instead.
 *
 * @param schema A object schema.
 *
 * @returns A object schema.
 */
export function passthrough<
  TSchema extends ObjectSchema<ObjectEntries, undefined>
>(schema: TSchema): TSchema {
  return {
    ...schema,
    _parse(input, config) {
      const result = schema._parse(input, config);
      if (result.typed) {
        result.output = { ...(input as object), ...result.output };
      }
      return result;
    },
  };
}
