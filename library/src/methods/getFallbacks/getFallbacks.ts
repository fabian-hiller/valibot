import type {
  ObjectEntries,
  ObjectSchema,
  TupleItems,
  TupleSchema,
} from '../../schemas/index.ts';
import type { BaseSchema } from '../../types.ts';
import type { SchemaWithMaybeFallback } from '../getFallback/index.ts';
import type { FallbackValues } from './types.ts';

/**
 * Returns the fallback values of the schema.
 *
 * Hint: The difference to `getFallback` is that for objects and tuples without
 * an explicit fallback value, this function recursively returns the fallback
 * values of the subschemas instead of `undefined`.
 *
 * @param schema The schema to get the fallback values from.
 *
 * @returns The fallback values.
 */
export function getFallbacks<
  TSchema extends SchemaWithMaybeFallback<
    BaseSchema | ObjectSchema<ObjectEntries, any> | TupleSchema<TupleItems, any>
  >
>(schema: TSchema): FallbackValues<TSchema> {
  // Create fallbacks variable
  let fallbacks: any;

  // If schema has a fallback, set its value
  if (schema.getFallback) {
    fallbacks = schema.getFallback();

    // Otherwise, check if schema is of kind object or tuple
  } else if ('schema' in schema) {
    // If it is an object schema, set object with fallback value of each entry
    if (schema.schema === 'object') {
      fallbacks = {};
      for (const key in schema.object.entries) {
        fallbacks[key] = getFallbacks(schema.object.entries[key]);
      }

      // If it is a tuple schema, set array with fallback value of each item
    } else if (schema.schema === 'tuple') {
      fallbacks = [];
      for (let key = 0; key < schema.tuple.items.length; key++) {
        fallbacks.push(getFallbacks(schema.tuple.items[key]));
      }
    }
  }

  // Return fallback values
  return fallbacks;
}
