import type {
  ObjectEntries,
  ObjectSchema,
} from '../../schemas/object/index.ts';
import { schemaIssue } from '../../utils/index.ts';

/**
 * Creates a strict object schema that throws an error if an input contains
 * unknown keys.
 *
 * @deprecated Use `object` with `rest` argument instead.
 *
 * @param schema A object schema.
 *
 * @returns A strict object schema.
 */
export function strict<TSchema extends ObjectSchema<ObjectEntries, undefined>>(
  schema: TSchema
): TSchema {
  return {
    ...schema,
    _parse(input, config) {
      const result = schema._parse(input, config);
      return !result.issues &&
        Object.keys(input as object).some((key) => !(key in schema.entries))
        ? schemaIssue(this, input, config)
        : result;
    },
  };
}
