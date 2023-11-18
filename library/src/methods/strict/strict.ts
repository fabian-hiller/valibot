import type {
  ObjectEntries,
  ObjectSchema,
} from '../../schemas/object/index.ts';
import type { ErrorMessage } from '../../types/index.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Creates a strict object schema that throws an error if an input contains
 * unknown keys.
 *
 * @deprecated Use `object` with `rest` argument instead.
 *
 * @param schema A object schema.
 * @param message The error message.
 *
 * @returns A strict object schema.
 */
export function strict<TSchema extends ObjectSchema<ObjectEntries, undefined>>(
  schema: TSchema,
  message: ErrorMessage = 'Invalid keys'
): TSchema {
  return {
    ...schema,
    _parse(input, info) {
      const result = schema._parse(input, info);
      return !result.issues &&
        Object.keys(input as object).some((key) => !(key in schema.entries))
        ? getSchemaIssues(info, 'object', 'strict', message, input)
        : result;
    },
  };
}
