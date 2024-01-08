import type {
  ObjectEntries,
  ObjectSchema,
  TupleItems,
  TupleSchema,
} from '../../schemas/index.ts';
import type { BaseSchema } from '../../types/index.ts';
import {
  getDefault,
  type SchemaWithMaybeDefault,
} from '../getDefault/index.ts';
import type { DefaultValues } from './types.ts';

/**
 * Returns the default values of the schema.
 *
 * Hint: The difference to `getDefault` is that for objects and tuples without
 * an explicit default value, this function recursively returns the default
 * values of the subschemas instead of `undefined`.
 *
 * @param schema The schema to get the default values from.
 *
 * @returns The default values.
 */
export function getDefaults<
  TSchema extends SchemaWithMaybeDefault<
    BaseSchema | ObjectSchema<ObjectEntries, any> | TupleSchema<TupleItems, any>
  >
>(schema: TSchema): DefaultValues<TSchema> {
  // Create defaults variable
  let defaults: any;

  // If schema contains a default function, set its default value
  if (schema.default !== undefined) {
    defaults = getDefault(schema);

    // Otherwise, check if schema is of kind object or tuple
  } else if ('type' in schema) {
    // If it is an object schema, set object with default value of each entry
    if (schema.type === 'object') {
      defaults = {};
      for (const key in schema.entries) {
        defaults[key] = getDefaults(schema.entries[key]);
      }

      // If it is a tuple schema, set array with default value of each item
    } else if (schema.type === 'tuple') {
      defaults = [];
      for (let key = 0; key < schema.items.length; key++) {
        defaults.push(getDefaults(schema.items[key]));
      }
    }
  }

  // Return default values
  return defaults;
}
